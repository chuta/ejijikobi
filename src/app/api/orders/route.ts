import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Add CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    // Log request details
    console.log('API Request received:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    });

    // Get the auth token from the request header
    const authHeader = request.headers.get('Authorization');
    console.log('Raw auth header:', authHeader);

    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header missing' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Extract the token from the Bearer format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    if (!token) {
      return NextResponse.json(
        { message: 'Invalid authorization token' },
        { status: 401, headers: corsHeaders }
      );
    }

    console.log('Token validation:', { 
      hasToken: !!token,
      tokenLength: token.length 
    });

    // Create a new Supabase client with the user's token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    // Parse request body
    const body = await request.json();
    console.log('Request body:', body);

    const {
      productId,
      size,
      quantity,
      payment_method,
      delivery_address,
      phone_number,
      status
    } = body;

    console.log('Received order request:', {
      productId,
      size,
      quantity,
      payment_method,
      status
    });

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Validate required fields
    if (!productId || !size || !quantity || !payment_method) {
      console.error('Missing required fields:', { productId, size, quantity, payment_method });
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get product price for calculations
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('price')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      console.error('Error fetching product:', productError);
      return NextResponse.json(
        { message: 'Failed to fetch product details' },
        { status: 500, headers: corsHeaders }
      );
    }

    const subtotal = product.price * parseInt(quantity);
    const shipping_fee = 1500; // ₦1,500 flat rate shipping
    const total = subtotal + shipping_fee;

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          status: status || 'pending',
          payment_status: payment_method === 'pay-on-delivery' ? 'pending' : 'awaiting_payment',
          payment_method,
          shipping_address: delivery_address ? { address: delivery_address, phone: phone_number } : null,
          shipping_method: 'standard',
          subtotal,
          shipping_fee,
          total
        }
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { message: `Failed to create order: ${orderError.message}` },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('Order created:', order);

    // Create the order item
    const { data: orderItem, error: orderItemError } = await supabase
      .from('order_items')
      .insert([
        {
          order_id: order.id,
          product_id: productId,
          quantity: parseInt(quantity),
          size,
          price: product.price
        }
      ])
      .select()
      .single();

    if (orderItemError) {
      console.error('Error creating order item:', orderItemError);
      // Delete the order since order item creation failed
      const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .eq('id', order.id);
      
      if (deleteError) {
        console.error('Error deleting failed order:', deleteError);
      }

      return NextResponse.json(
        { message: `Failed to create order items: ${orderItemError.message}` },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('Order item created:', orderItem);
    return NextResponse.json({ order, orderItem }, { 
      headers: corsHeaders 
    });

  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json(
      { 
        message: err instanceof Error ? err.message : 'Internal server error',
        error: err instanceof Error ? err.toString() : 'Unknown error'
      },
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
} 