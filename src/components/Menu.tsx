import { useEffect, useState } from 'react'
import { playSound } from '../hooks/useSound'

type MenuItem = {
    id: number
    name: string
    description: string
    price: number
    category: string
}

type OrderItem = MenuItem & {
    quantity: number
}

const API_URL = import.meta.env.VITE_API_URL

function Menu() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [order, setOrder] = useState<OrderItem[]>([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [cartOpen, setCartOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null)

    const path = window.location.pathname
    const parts = path.split('/')
    const tableNumber = path.startsWith('/table/') ? parts[2] : undefined

    useEffect(() => {
        async function loadMenu() {
            try {
                const response = await fetch(`${API_URL}/api/menu`)

                if (!response.ok) {
                    throw new Error('Failed to load menu')
                }

                const data = await response.json()
                setMenuItems(data)
            } catch (error) {
                console.error(error)
                setMessage('Could not load the menu.')
            } finally {
                setLoading(false)
            }
        }

        loadMenu()
    }, [])

    function addToOrder(item: MenuItem) {
        playSound('addToCart')
        setOrder((currentOrder) => {
            const existingItem = currentOrder.find(
                (orderItem) => orderItem.id === item.id
            )

            if (existingItem) {
                return currentOrder.map((orderItem) =>
                    orderItem.id === item.id
                        ? {
                            ...orderItem,
                            quantity: orderItem.quantity + 1,
                        }
                        : orderItem
                )
            }

            return [
                ...currentOrder,
                {
                    ...item,
                    quantity: 1,
                },
            ]
        })
    }

    function decreaseQuantity(itemId: number) {
        playSound('removeFromCart')
        setOrder((currentOrder) =>
            currentOrder
                .map((orderItem) =>
                    orderItem.id === itemId
                        ? {
                            ...orderItem,
                            quantity: orderItem.quantity - 1,
                        }
                        : orderItem
                )
                .filter((orderItem) => orderItem.quantity > 0)
        )
    }

    function getTotal() {
        return order.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        )
    }

    function getItemCount() {
        return order.reduce((count, item) => count + item.quantity, 0)
    }

    async function placeOrder() {
        if (!tableNumber) {
            setMessage('Table number is missing.')
            return
        }

        if (order.length === 0) {
            setMessage('Please add something to your order.')
            return
        }

        try {
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tableNumber: Number(tableNumber),
                    items: order.map((item) => ({
                        id: item.id,
                        quantity: item.quantity,
                    })),
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setMessage(data.message || 'Could not place order.')
                return
            }

            playSound('success')
            setOrderSuccess(
                `${data.message} Order #${data.orderId}. Total: ₹${data.total}`
            )

            setOrder([])
            setCartOpen(false)
            setMessage('')
        } catch (error) {
            console.error(error)
            setMessage('Could not place order.')
        }
    }

    const categories = [
        ...new Set(menuItems.map((item) => item.category)),
    ]

    const filteredItems = activeCategory
        ? menuItems.filter((item) => item.category === activeCategory)
        : menuItems

    const displayCategories = activeCategory
        ? [activeCategory]
        : categories

    if (loading) {
        return (
            <div className="loading-page">
                <div className="spinner"></div>
                <p>Loading menu...</p>
            </div>
        )
    }

    return (
        <div className="menu-page">
            <div className="container">
                {/* Header */}
                <div className="menu-header">
                    {tableNumber && (
                        <div className="table-banner">
                            🪑 Table {tableNumber}
                        </div>
                    )}

                    <h1>Our Menu</h1>

                    {message && (
                        <div className="message message-error">{message}</div>
                    )}
                </div>

                {/* Category Navigation */}
                <div className="category-nav">
                    <button
                        className={`category-pill ${activeCategory === null ? 'active' : ''}`}
                        onClick={() => { playSound('click'); setActiveCategory(null) }}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`category-pill ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => { playSound('click'); setActiveCategory(category) }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="menu-grid">
                    {displayCategories.map((category) => (
                        <div key={category} style={{ display: 'contents' }}>
                            <div className="menu-category-title">
                                <h2>{category}</h2>
                            </div>

                            {filteredItems
                                .filter((item) => item.category === category)
                                .map((item) => {
                                    const inCart = order.find((o) => o.id === item.id)

                                    return (
                                        <div key={item.id} className="card card-glow menu-card">
                                            <div className="menu-card-header">
                                                <div>
                                                    <h3>{item.name}</h3>
                                                    <span className="badge badge-category">
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <span className="menu-card-price">
                                                    ₹{item.price}
                                                </span>
                                            </div>

                                            <p className="menu-card-description">
                                                {item.description}
                                            </p>

                                            <div className="menu-card-footer">
                                                {inCart ? (
                                                    <div className="cart-item-controls">
                                                        <button
                                                            className="qty-btn"
                                                            onClick={() => decreaseQuantity(item.id)}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="qty-display">
                                                            {inCart.quantity}
                                                        </span>
                                                        <button
                                                            className="qty-btn"
                                                            onClick={() => addToOrder(item)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}

                                                <button
                                                    className="add-to-order-btn"
                                                    onClick={() => addToOrder(item)}
                                                >
                                                    + Add
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Toggle Button */}
            {order.length > 0 && (
                <button
                    className="cart-toggle"
                    onClick={() => { playSound('click'); setCartOpen(true) }}
                >
                    🛒 View Cart
                    <span className="cart-count">{getItemCount()}</span>
                    <span>₹{getTotal()}</span>
                </button>
            )}

            {/* Cart Panel */}
            {cartOpen && (
                <>
                    <div
                        className="cart-overlay"
                        onClick={() => setCartOpen(false)}
                    ></div>

                    <div className="cart-panel">
                        <div className="cart-header">
                            <h2>Your Order</h2>
                            <button
                                className="cart-close"
                                onClick={() => setCartOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {order.length === 0 ? (
                            <div className="cart-empty">
                                <span className="cart-empty-icon">🛸</span>
                                <p>Your order is empty</p>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {order.map((item) => (
                                        <div key={item.id} className="cart-item">
                                            <div className="cart-item-info">
                                                <div className="cart-item-name">
                                                    {item.name}
                                                </div>
                                                <div className="cart-item-price">
                                                    ₹{item.price} each
                                                </div>
                                            </div>

                                            <div className="cart-item-controls">
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => decreaseQuantity(item.id)}
                                                >
                                                    −
                                                </button>
                                                <span className="qty-display">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    className="qty-btn"
                                                    onClick={() => addToOrder(item)}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <span className="cart-item-total">
                                                ₹{item.price * item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="cart-footer">
                                    <div className="cart-total">
                                        <span className="cart-total-label">
                                            Grand Total
                                        </span>
                                        <span className="cart-total-amount">
                                            ₹{getTotal()}
                                        </span>
                                    </div>

                                    {tableNumber ? (
                                        <button
                                            className="btn btn-primary btn-lg"
                                            onClick={placeOrder}
                                        >
                                            🚀 Place Order
                                        </button>
                                    ) : (
                                        <p className="message message-info">
                                            Scan a table QR code to place an order
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* Order Success Overlay */}
            {orderSuccess && (
                <div className="order-success-overlay" onClick={() => setOrderSuccess(null)}>
                    <div className="order-success-card" onClick={(e) => e.stopPropagation()}>
                        <span className="order-success-icon">✅</span>
                        <h2>Order Placed!</h2>
                        <p>{orderSuccess}</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setOrderSuccess(null)}
                        >
                            Continue Browsing
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Menu