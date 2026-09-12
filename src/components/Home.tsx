function Home() {
    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-orb hero-orb-1"></div>
                <div className="hero-orb hero-orb-2"></div>
                <div className="hero-orb hero-orb-3"></div>

                <div className="container hero-content">
                    <span className="hero-badge">
                        ✦ Now Open for Dine-In & Takeaway
                    </span>

                    <h1>Dining Among the Stars</h1>

                    <p className="hero-tagline">
                        A cosmic culinary journey where bold flavors meet
                        futuristic ambiance. Experience dining like never before
                        at Stellar Bites.
                    </p>

                    <div className="hero-buttons">
                        <a href="/menu" className="btn btn-primary btn-lg">
                            🍽️ View Menu
                        </a>
                        <a href="/reservation" className="btn btn-secondary btn-lg">
                            📅 Book a Table
                        </a>
                    </div>
                </div>
            </section>

            {/* Featured Dishes */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2>Signature Experiences</h2>
                        <hr className="section-divider" />
                        <p>
                            Discover our chef's most celebrated creations,
                            crafted with passion and cosmic inspiration.
                        </p>
                    </div>

                    <div className="featured-grid">
                        <div className="card card-glow featured-card">
                            <span className="featured-card-icon">🥗</span>
                            <h3>Stellar Starters</h3>
                            <p>
                                Begin your voyage with handcrafted appetizers
                                bursting with flavor and artfully presented.
                            </p>
                        </div>

                        <div className="card card-glow featured-card">
                            <span className="featured-card-icon">🍛</span>
                            <h3>Nebula Mains</h3>
                            <p>
                                Rich, bold entrées prepared with the finest
                                ingredients from around the galaxy.
                            </p>
                        </div>

                        <div className="card card-glow featured-card">
                            <span className="featured-card-icon">🍰</span>
                            <h3>Cosmic Desserts</h3>
                            <p>
                                End your journey on a sweet note with our
                                heavenly dessert collection.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="section">
                <div className="container">
                    <div className="about-content">
                        <div className="about-visual"></div>

                        <div className="about-text">
                            <h2>Our Story</h2>
                            <hr className="section-divider" style={{ margin: '16px 0' }} />
                            <p>
                                Born from the dream of creating an out-of-this-world
                                dining experience, Stellar Bites brings together
                                the best of modern gastronomy and futuristic design.
                            </p>
                            <p>
                                Every dish is a mission — crafted with precision,
                                served with warmth, and designed to leave you
                                starstruck. Our crew is dedicated to making your
                                visit unforgettable.
                            </p>
                            <a href="/menu" className="btn btn-secondary" style={{ marginTop: '16px' }}>
                                Explore Our Menu →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2>Ready for Liftoff? 🚀</h2>
                        <p>
                            Reserve your table now and embark on a culinary
                            adventure among the stars. Walk-ins welcome!
                        </p>
                        <a href="/reservation" className="btn btn-primary btn-lg">
                            Book Your Table
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-inner">
                        <div className="footer-brand">
                            <div className="footer-brand-name">
                                🚀 Stellar Bites
                            </div>
                            <p>
                                A cosmic dining experience where extraordinary
                                flavors meet futuristic ambiance.
                            </p>
                        </div>

                        <div className="footer-links">
                            <div className="footer-links-col">
                                <h4>Navigate</h4>
                                <a href="/">Home</a>
                                <a href="/menu">Menu</a>
                                <a href="/reservation">Reservations</a>
                            </div>
                            <div className="footer-links-col">
                                <h4>Contact</h4>
                                <a href="#">info@stellarbites.com</a>
                                <a href="#">+91 98765 43210</a>
                                <a href="#">Space Station Alpha</a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        © {new Date().getFullYear()} Stellar Bites. All rights reserved.
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Home