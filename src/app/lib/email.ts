import { Resend } from 'resend';
import { Order } from '../types/order';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(order: Order) {
  try {
    await resend.emails.send({
      from: 'Ejiji Kobi <orders@ejijikobi.com>',
      to: [order.shipping_address.email],
      subject: `Order Confirmed - #${order.id}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order #${order.id} has been confirmed and is being processed.</p>
        <h2>Order Details</h2>
        <p>Order Status: ${order.status}</p>
        <p>Payment Method: ${order.payment_method}</p>
        <p>Shipping Method: ${order.shipping_method}</p>
        
        <h3>Items</h3>
        ${order.items.map(item => `
          <div>
            <p>${item.name} x ${item.quantity}</p>
            <p>Size: ${item.size}</p>
            <p>Price: ₦${item.price.toLocaleString()}</p>
          </div>
        `).join('')}
        
        <h3>Shipping Address</h3>
        <p>${order.shipping_address.full_name}</p>
        <p>${order.shipping_address.address}</p>
        <p>${order.shipping_address.city}, ${order.shipping_address.state}</p>
        <p>${order.shipping_address.postal_code}</p>
        <p>${order.shipping_address.country}</p>
        
        <h3>Order Summary</h3>
        <p>Subtotal: ₦${order.subtotal.toLocaleString()}</p>
        <p>Shipping: ₦${order.shipping_fee.toLocaleString()}</p>
        <p>Total: ₦${order.total.toLocaleString()}</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
}

export async function sendOrderStatusUpdateEmail(order: Order) {
  try {
    await resend.emails.send({
      from: 'Ejiji Kobi <orders@ejijikobi.com>',
      to: [order.shipping_address.email],
      subject: `Order Status Update - #${order.id}`,
      html: `
        <h1>Order Status Update</h1>
        <p>Your order #${order.id} has been updated.</p>
        <p>New Status: ${order.status}</p>
        ${order.tracking_number ? `
          <p>Tracking Number: ${order.tracking_number}</p>
          <p>Track your order: <a href="${order.tracking_url}">Click here</a></p>
        ` : ''}
        
        <h2>Order Details</h2>
        <p>Order Date: ${new Date(order.created_at).toLocaleDateString()}</p>
        <p>Payment Method: ${order.payment_method}</p>
        <p>Shipping Method: ${order.shipping_method}</p>
        
        <h3>Need Help?</h3>
        <p>If you have any questions about your order, please contact our customer service.</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send order status update email:', error);
  }
} 