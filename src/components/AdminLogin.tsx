import { useState } from 'react'
import { supabase } from '../supabaseClient'

function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    async function login(event: React.FormEvent) {
        event.preventDefault()

        setMessage('')

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setMessage(error.message)
            return
        }

        window.location.href = '/admin'
    }

    return (
        <div className="admin-login-page">
            <div className="card admin-login-card">
                <div className="admin-login-header">
                    <span className="admin-login-icon">🛰️</span>
                    <h1>Mission Control</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Admin access — authorized crew only
                    </p>
                </div>

                <form onSubmit={login} className="admin-login-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            ✉️ Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="admin@stellarbites.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            🔒 Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                        🚀 Login
                    </button>
                </form>

                {message && (
                    <div className="message message-error" style={{ marginTop: '16px' }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminLogin