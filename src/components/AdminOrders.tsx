import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

type OrderItem = {
    quantity: number
    price: number
    menu_item_id: number
    menu_items: {
        name: string
    }
}

type Order = {
    id: number
    table_number: number
    total: number
    status: string
    created_at: string
    order_items: OrderItem[]
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

function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    async function loadOrders() {
        try {
            const headers = await getAuthHeaders()

            const response = await fetch(`${API_URL}/api/orders`, {
                headers,
            })

            if (!response.ok) {
                throw new Error('Failed to load orders')
            }

            const data = await response.json()
            setOrders(data)
            setMessage('')
        } catch (error) {
            console.error(error)
            setMessage('Could not load orders.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadOrders()
    }, [])

    async function updateStatus(
        orderId: number,
        status: string
    ) {
        try {
            const headers = await getAuthHeaders()

            const response = await fetch(
                `${API_URL}/api/orders/${orderId}/status`,
                {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({
                        status,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error('Failed to update status')
            }

            await loadOrders()
        } catch (error) {
            console.error(error)
            setMessage('Could not update order status.')
        }
    }

    if (loading) {
        return (
            <main>
                <h1>Orders</h1>
                <p>Loading orders...</p>
            </main>
        )
    }

    return (
        <main>
            <h1>Orders</h1>

            {message && <p>{message}</p>}

            {orders.length === 0 ? (
                <p>No orders yet.</p>
            ) : (
                orders.map((order) => (
                    <section key={order.id}>
                        <h2>Order #{order.id}</h2>

                        <p>Table: {order.table_number}</p>

                        <p>
                            Status: <strong>{order.status}</strong>
                        </p>

                        <h3>Items</h3>

                        {order.order_items.map((item) => (
                            <p
                                key={`${order.id}-${item.menu_item_id}`}
                            >
                                {item.menu_items.name} × {item.quantity} — ₹
                                {item.price * item.quantity}
                            </p>
                        ))}

                        <h3>Total: ₹{order.total}</h3>

                        <div>
                            {order.status === 'pending' && (
                                <button
                                    onClick={() =>
                                        updateStatus(order.id, 'preparing')
                                    }
                                >
                                    Start Preparing
                                </button>
                            )}

                            {order.status === 'preparing' && (
                                <button
                                    onClick={() =>
                                        updateStatus(order.id, 'completed')
                                    }
                                >
                                    Mark Completed
                                </button>
                            )}

                            {(order.status === 'pending' ||
                                order.status === 'preparing') && (
                                    <button
                                        onClick={() =>
                                            updateStatus(order.id, 'cancelled')
                                        }
                                    >
                                        Cancel
                                    </button>
                                )}
                        </div>

                        <hr />
                    </section>
                ))
            )}
        </main>
    )
}

export default AdminOrders