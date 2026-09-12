import { useState } from 'react'
import { playSound } from '../hooks/useSound'

const API_URL = import.meta.env.VITE_API_URL

function Reservation() {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [partySize, setPartySize] = useState(2)
    const [message, setMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    async function bookTable(event: React.FormEvent) {
        event.preventDefault()

        setMessage('')
        setIsSuccess(false)

        try {
            const response = await fetch(`${API_URL}/api/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerName: name,
                    phone,
                    reservationDate: date,
                    reservationTime: time,
                    partySize,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setMessage(data.message || 'Could not book the table.')
                setIsSuccess(false)
                return
            }

            setMessage(
                `${data.message} Reservation #${data.reservationId}`
            )
            setIsSuccess(true)
            playSound('success')

            setName('')
            setPhone('')
            setDate('')
            setTime('')
            setPartySize(2)
        } catch (error) {
            console.error(error)
            setMessage('Could not connect to the server.')
            setIsSuccess(false)
        }
    }

    return (
        <div className="reservation-page">
            <div className="container">
                <div className="card reservation-card">
                    <div className="reservation-header">
                        <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>📅</span>
                        <h1>Book a Table</h1>
                        <p>Reserve your seat among the stars</p>
                    </div>

                    <form onSubmit={bookTable} className="reservation-form">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                👤 Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="form-input"
                                placeholder="Your full name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                                📞 Phone
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                className="form-input"
                                placeholder="Your phone number"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="date" className="form-label">
                                    📆 Date
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    className="form-input"
                                    value={date}
                                    onChange={(event) => setDate(event.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="time" className="form-label">
                                    🕐 Time
                                </label>
                                <input
                                    id="time"
                                    type="time"
                                    className="form-input"
                                    value={time}
                                    onChange={(event) => setTime(event.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="partySize" className="form-label">
                                👥 Number of People
                            </label>
                            <input
                                id="partySize"
                                type="number"
                                className="form-input"
                                min="1"
                                max="20"
                                value={partySize}
                                onChange={(event) =>
                                    setPartySize(Number(event.target.value))
                                }
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                            🚀 Book Table
                        </button>
                    </form>

                    {message && (
                        <div className={`message ${isSuccess ? 'message-success' : 'message-error'}`}
                            style={{ marginTop: '20px' }}
                        >
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Reservation