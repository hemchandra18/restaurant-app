import { useState } from 'react'
import MusicToggle from './MusicToggle'
import { playSound } from '../hooks/useSound'

function Navbar() {
    const path = window.location.pathname
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <a href="/" className="navbar-logo">
                    <span className="navbar-logo-icon">🚀</span>
                    Stellar Bites
                </a>

                <button
                    className="navbar-hamburger"
                    onClick={() => {
                        playSound('click')
                        setMenuOpen(!menuOpen)
                    }}
                    aria-label="Toggle navigation"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <li>
                        <a
                            href="/"
                            className={`navbar-link ${path === '/' ? 'active' : ''}`}
                            onClick={() => {
                                playSound('click')
                                setMenuOpen(false)
                            }}
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <a
                            href="/menu"
                            className={`navbar-link ${path === '/menu' ? 'active' : ''}`}
                            onClick={() => {
                                playSound('click')
                                setMenuOpen(false)
                            }}
                        >
                            Menu
                        </a>
                    </li>
                    <li>
                        <a
                            href="/reservation"
                            className={`navbar-link ${path === '/reservation' ? 'active' : ''}`}
                            onClick={() => {
                                playSound('click')
                                setMenuOpen(false)
                            }}
                        >
                            Book a Table
                        </a>
                    </li>
                    <li>
                        <MusicToggle />
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar