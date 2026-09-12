import express from 'express'
import cors from 'cors'
import { supabase } from './supabase.js'

const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// ------------------------------------
// Admin authentication middleware
// ------------------------------------
async function requireAdmin(req, res, next) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Authentication required.'
            })
        }

        const accessToken = authHeader.replace('Bearer ', '')

        const {
            data: { user },
            error
        } = await supabase.auth.getUser(accessToken)

        if (error || !user) {
            return res.status(401).json({
                message: 'Invalid or expired session.'
            })
        }

        req.user = user

        next()
    } catch (error) {
        console.error(error)

        return res.status(401).json({
            message: 'Authentication failed.'
        })
    }
}

// ------------------------------------
// Get menu
// ------------------------------------
app.get('/api/menu', async (req, res) => {
    const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('id')

    if (error) {
        console.error(error)

        return res.status(500).json({
            message: 'Failed to load menu.'
        })
    }

    res.json(data)
})

// ------------------------------------
// Create order
// ------------------------------------
app.post('/api/orders', async (req, res) => {
    try {
        const { tableNumber, items } = req.body

        if (
            !tableNumber ||
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return res.status(400).json({
                message: 'Invalid order.'
            })
        }

        const itemIds = items.map((item) => Number(item.id))

        const { data: menuItems, error: menuError } =
            await supabase
                .from('menu_items')
                .select('id, name, price')
                .in('id', itemIds)

        if (menuError) {
            console.error(menuError)

            return res.status(500).json({
                message: 'Failed to verify menu items.'
            })
        }

        if (
            !menuItems ||
            menuItems.length !== itemIds.length
        ) {
            return res.status(400).json({
                message: 'One or more menu items are invalid.'
            })
        }

        let total = 0

        const orderItems = items.map((item) => {
            const menuItem = menuItems.find(
                (menuItem) =>
                    menuItem.id === Number(item.id)
            )

            const quantity = Number(item.quantity)

            if (!Number.isInteger(quantity) || quantity <= 0) {
                throw new Error('Invalid quantity.')
            }

            total += Number(menuItem.price) * quantity

            return {
                menu_item_id: menuItem.id,
                quantity,
                price: menuItem.price
            }
        })

        const { data: order, error: orderError } =
            await supabase
                .from('orders')
                .insert({
                    table_number: Number(tableNumber),
                    total,
                    status: 'pending'
                })
                .select()
                .single()

        if (orderError) {
            console.error(orderError)

            return res.status(500).json({
                message: 'Failed to create order.'
            })
        }

        const itemsToInsert = orderItems.map((item) => ({
            ...item,
            order_id: order.id
        }))

        const { error: itemsError } =
            await supabase
                .from('order_items')
                .insert(itemsToInsert)

        if (itemsError) {
            console.error(itemsError)

            return res.status(500).json({
                message:
                    'Order was created, but items could not be saved.'
            })
        }

        res.json({
            message: 'Order placed successfully!',
            orderId: order.id,
            total
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Something went wrong.'
        })
    }
})

// ------------------------------------
// Create reservation
// ------------------------------------
app.post('/api/reservations', async (req, res) => {
    try {
        const {
            customerName,
            phone,
            reservationDate,
            reservationTime,
            partySize
        } = req.body

        const { data: reservation, error } =
            await supabase
                .from('reservations')
                .insert({
                    customer_name: customerName,
                    phone,
                    reservation_date: reservationDate,
                    reservation_time: reservationTime,
                    party_size: partySize,
                    status: 'pending'
                })
                .select()
                .single()

        if (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Failed to create reservation.'
            })
        }

        res.json({
            message: 'Table booked successfully!',
            reservationId: reservation.id
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Something went wrong.'
        })
    }
})

// ====================================
// PROTECTED ADMIN ROUTES
// ====================================

// ------------------------------------
// Get all orders
// ------------------------------------
app.get(
    '/api/orders',
    requireAdmin,
    async (req, res) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          id,
          table_number,
          total,
          status,
          created_at,
          order_items (
            quantity,
            price,
            menu_item_id,
            menu_items (
              name
            )
          )
        `)
                .order('created_at', {
                    ascending: false
                })

            if (error) {
                console.error(error)

                return res.status(500).json({
                    message: 'Failed to load orders.'
                })
            }

            res.json(data)
        } catch (error) {
            console.error(error)

            res.status(500).json({
                message: 'Something went wrong.'
            })
        }
    }
)

// ------------------------------------
// Update order status
// ------------------------------------
app.patch(
    '/api/orders/:id/status',
    requireAdmin,
    async (req, res) => {
        try {
            const orderId = Number(req.params.id)
            const { status } = req.body

            const allowedStatuses = [
                'pending',
                'preparing',
                'completed',
                'cancelled'
            ]

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message: 'Invalid order status.'
                })
            }

            const { data, error } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', orderId)
                .select()
                .single()

            if (error) {
                console.error(error)

                return res.status(500).json({
                    message:
                        'Failed to update order status.'
                })
            }

            res.json({
                message: 'Order status updated.',
                order: data
            })
        } catch (error) {
            console.error(error)

            res.status(500).json({
                message: 'Something went wrong.'
            })
        }
    }
)

// ------------------------------------
// Get all reservations
// ------------------------------------
app.get(
    '/api/reservations',
    requireAdmin,
    async (req, res) => {
        try {
            const { data, error } =
                await supabase
                    .from('reservations')
                    .select('*')
                    .order('reservation_date', {
                        ascending: true
                    })
                    .order('reservation_time', {
                        ascending: true
                    })

            if (error) {
                console.error(error)

                return res.status(500).json({
                    message:
                        'Failed to load reservations.'
                })
            }

            res.json(data)
        } catch (error) {
            console.error(error)

            res.status(500).json({
                message: 'Something went wrong.'
            })
        }
    }
)

// ------------------------------------
// Update reservation status
// ------------------------------------
app.patch(
    '/api/reservations/:id/status',
    requireAdmin,
    async (req, res) => {
        try {
            const reservationId =
                Number(req.params.id)

            const { status } = req.body

            const allowedStatuses = [
                'pending',
                'confirmed',
                'cancelled',
                'completed'
            ]

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message:
                        'Invalid reservation status.'
                })
            }

            const { data, error } =
                await supabase
                    .from('reservations')
                    .update({ status })
                    .eq('id', reservationId)
                    .select()
                    .single()

            if (error) {
                console.error(error)

                return res.status(500).json({
                    message:
                        'Failed to update reservation status.'
                })
            }

            res.json({
                message:
                    'Reservation status updated.',
                reservation: data
            })
        } catch (error) {
            console.error(error)

            res.status(500).json({
                message: 'Something went wrong.'
            })
        }
    }
)

// ------------------------------------
// Start server
// ------------------------------------
app.listen(
    PORT,
    '0.0.0.0',
    () => {
        console.log(
            `Backend running on http://localhost:${PORT}`
        )
    }
)