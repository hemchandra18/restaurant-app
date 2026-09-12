import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

type Reservation = {
    id: number
    customer_name: string
    phone: string
    reservation_date: string
    reservation_time: string
    party_size: number
    status: string
    created_at: string
}

const API_URL = import.meta.env.VITE_API_URL

async function getAuthHeaders() {
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        throw new Error('You are not logged in.')
    }

    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
    }
}

function AdminReservations() {
    const [reservations, setReservations] = useState<
        Reservation[]
    >([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    async function loadReservations() {
        try {
            const headers = await getAuthHeaders()

            const response = await fetch(
                `${API_URL}/api/reservations`,
                {
                    headers,
                }
            )

            if (!response.ok) {
                throw new Error(
                    'Failed to load reservations'
                )
            }

            const data = await response.json()
            setReservations(data)
            setMessage('')
        } catch (error) {
            console.error(error)
            setMessage('Could not load reservations.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadReservations()
    }, [])

    async function updateStatus(
        reservationId: number,
        status: string
    ) {
        try {
            const headers = await getAuthHeaders()

            const response = await fetch(
                `${API_URL}/api/reservations/${reservationId}/status`,
                {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({
                        status,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error(
                    'Failed to update reservation status'
                )
            }

            await loadReservations()
        } catch (error) {
            console.error(error)
            setMessage(
                'Could not update reservation status.'
            )
        }
    }

    if (loading) {
        return (
            <main>
                <h1>Reservations</h1>
                <p>Loading reservations...</p>
            </main>
        )
    }

    return (
        <main>
            <h1>Reservations</h1>

            {message && <p>{message}</p>}

            {reservations.length === 0 ? (
                <p>No reservations yet.</p>
            ) : (
                reservations.map((reservation) => (
                    <section key={reservation.id}>
                        <h2>Reservation #{reservation.id}</h2>

                        <p>
                            <strong>Name:</strong>{' '}
                            {reservation.customer_name}
                        </p>

                        <p>
                            <strong>Phone:</strong>{' '}
                            {reservation.phone}
                        </p>

                        <p>
                            <strong>Date:</strong>{' '}
                            {reservation.reservation_date}
                        </p>

                        <p>
                            <strong>Time:</strong>{' '}
                            {reservation.reservation_time}
                        </p>

                        <p>
                            <strong>People:</strong>{' '}
                            {reservation.party_size}
                        </p>

                        <p>
                            <strong>Status:</strong>{' '}
                            {reservation.status}
                        </p>

                        <div>
                            {reservation.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                reservation.id,
                                                'confirmed'
                                            )
                                        }
                                    >
                                        Confirm
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                reservation.id,
                                                'cancelled'
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}

                            {reservation.status === 'confirmed' && (
                                <>
                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                reservation.id,
                                                'completed'
                                            )
                                        }
                                    >
                                        Mark Completed
                                    </button>

                                    <button
                                        onClick={() =>
                                            updateStatus(
                                                reservation.id,
                                                'cancelled'
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>

                        <hr />
                    </section>
                ))
            )}
        </main>
    )
}

export default AdminReservations