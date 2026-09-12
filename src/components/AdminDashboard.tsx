import { supabase } from '../supabaseClient'

function AdminDashboard() {
    async function logout() {
        await supabase.auth.signOut()

        window.location.href = '/admin/login'
    }

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <div className="container admin-header-inner">
                    <a href="/admin" className="navbar-logo">
                        <span className="navbar-logo-icon">🛰️</span>
                        Mission Control
                    </a>

                    <div className="admin-nav">
                        <a href="/admin/orders" className="admin-nav-link">
                            📋 Orders
                        </a>
                        <a href="/admin/reservations" className="admin-nav-link">
                            📅 Reservations
                        </a>
                        <button onClick={logout} className="btn btn-danger btn-sm">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="admin-content">
                <div className="container">
                    <div className="section-header">
                        <h1>Dashboard</h1>
                        <p>Welcome back, Commander. Manage your restaurant operations.</p>
                    </div>

                    <div className="admin-dash-grid">
                        <a href="/admin/orders" className="card card-glow admin-dash-card" style={{ textDecoration: 'none' }}>
                            <span className="admin-dash-card-icon">📋</span>
                            <h3>Orders</h3>
                            <p>
                                View incoming orders and update their status.
                            </p>
                        </a>

                        <a href="/admin/reservations" className="card card-glow admin-dash-card" style={{ textDecoration: 'none' }}>
                            <span className="admin-dash-card-icon">📅</span>
                            <h3>Reservations</h3>
                            <p>
                                View table bookings and manage reservations.
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard