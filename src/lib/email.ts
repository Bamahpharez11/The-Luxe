import nodemailer from 'nodemailer'
import type { Order } from '@/lib/order-store'

export async function sendOrderConfirmationEmail(order: Order) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured. Skipping owner email notification.')
    return
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.OWNER_EMAIL || process.env.SMTP_USER,
    subject: `New Order Received - #${order.id} - ${order.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Order Received: #${order.id}</h2>
        <p><strong>Customer:</strong> ${order.name}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Email:</strong> ${order.email || 'N/A'}</p>
        <hr />
        <p><strong>Item:</strong> ${order.itemName} (x${order.quantity})</p>
        <p><strong>Add-Ons:</strong> ${order.addOns.length ? order.addOns.join(', ') : 'None'}</p>
        <p><strong>Order Type:</strong> ${order.orderType}</p>
        <p><strong>Date Requested:</strong> ${order.date}</p>
        <p><strong>Notes:</strong> ${order.notes || 'None'}</p>
        <hr />
        <h3><strong>Total:</strong> $${order.total}</h3>
        <br />
        <p>Please log in to the <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin">Admin Dashboard</a> to manage this order.</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Order notification email sent to owner for order ${order.id}`)
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
  }
}
