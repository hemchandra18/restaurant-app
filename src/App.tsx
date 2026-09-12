import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

import Navbar from './components/Navbar'
import Home from './components/Home'
import Menu from './components/Menu'
import Reservation from './components/Reservation'
import TableQRCode from './components/TableQRCode'
import AdminOrders from './components/AdminOrders'
import AdminReservations from './components/AdminReservations'
import AdminDashboard from './components/AdminDashboard'
import AdminLogin from './components/AdminLogin'

function App() {
  const path = window.location.pathname

  const [session, setSession] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const isTablePage = path.startsWith('/table/')
  const isMenuPage = path === '/menu'
  const isReservationPage = path === '/reservation'
  const isAdminLoginPage = path === '/admin/login'
  const isAdminPage = path === '/admin'
  const isAdminOrdersPage = path === '/admin/orders'
  const isAdminReservationsPage =
    path === '/admin/reservations'

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()

      setSession(data.session)
      setCheckingAuth(false)
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (checkingAuth && (
    isAdminPage ||
    isAdminOrdersPage ||
    isAdminReservationsPage
  )) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (
    (isAdminPage ||
      isAdminOrdersPage ||
      isAdminReservationsPage) &&
    !session
  ) {
    window.location.href = '/admin/login'
    return null
  }

  return (
    <div>
      {isTablePage ? (
        <Menu />
      ) : isMenuPage ? (
        <>
          <Navbar />
          <Menu />
        </>
      ) : isReservationPage ? (
        <>
          <Navbar />
          <Reservation />
        </>
      ) : isAdminLoginPage ? (
        session ? (
          <AdminDashboard />
        ) : (
          <AdminLogin />
        )
      ) : isAdminPage ? (
        <AdminDashboard />
      ) : isAdminOrdersPage ? (
        <AdminOrders />
      ) : isAdminReservationsPage ? (
        <AdminReservations />
      ) : (
        <>
          <Navbar />
          <Home />

          <div className="container">
            <div className="section">
              <div className="section-header">
                <h2>Table QR Codes</h2>
                <hr className="section-divider" />
                <p>Scan to order directly from your table</p>
              </div>

              <div className="qr-grid">
                <TableQRCode tableNumber={1} />
                <TableQRCode tableNumber={2} />
                <TableQRCode tableNumber={3} />
                <TableQRCode tableNumber={4} />
                <TableQRCode tableNumber={5} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App