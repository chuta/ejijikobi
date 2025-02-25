-- Drop dependent views first
DROP VIEW IF EXISTS public.admin_dashboard_stats CASCADE;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can delete their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can update their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can delete their own order items" ON public.order_items;

-- Drop existing functions and tables with CASCADE
DROP FUNCTION IF EXISTS public.get_orders_with_items(integer, integer, text) CASCADE;
DROP FUNCTION IF EXISTS public.get_orders_with_items CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

-- Create orders table with all necessary columns
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    payment_status text NOT NULL DEFAULT 'pending',
    payment_method text,
    payment_intent_id text,
    shipping_method text,
    shipping_address jsonb NOT NULL,
    tracking_number text,
    tracking_url text,
    subtotal INTEGER NOT NULL DEFAULT 0,
    shipping_fee INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id uuid REFERENCES public.orders(id) NOT NULL,
    product_id uuid REFERENCES public.products(id) NOT NULL,
    quantity integer NOT NULL,
    size text NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create their own orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
    ON public.orders FOR UPDATE
    USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their own orders"
    ON public.orders FOR DELETE
    USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own order items"
    ON public.order_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
        ))
    ));

CREATE POLICY "Users can create their own order items"
    ON public.order_items FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_id
        AND orders.user_id = auth.uid()
    ));

CREATE POLICY "Users can update their own order items"
    ON public.order_items FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
        ))
    ));

CREATE POLICY "Users can delete their own order items"
    ON public.order_items FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
        ))
    ));

-- Create the function
CREATE OR REPLACE FUNCTION public.get_orders_with_items(
    items_per_page integer DEFAULT 10,
    page_number integer DEFAULT 1,
    status_filter text DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    user_id uuid,
    status text,
    payment_status text,
    payment_method text,
    shipping_method text,
    shipping_address jsonb,
    tracking_number text,
    tracking_url text,
    subtotal numeric,
    shipping_fee numeric,
    total numeric,
    notes text,
    created_at timestamptz,
    updated_at timestamptz,
    items jsonb,
    user_info jsonb,
    total_count bigint
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id uuid;
    v_is_admin boolean;
BEGIN
    -- Get the current user's ID
    v_user_id := auth.uid();
    
    -- Check if the user is an admin
    SELECT EXISTS (
        SELECT 1 FROM admin_users au WHERE au.user_id = v_user_id
    ) INTO v_is_admin;

    RETURN QUERY
    WITH order_items_json AS (
        SELECT 
            oi.order_id,
            jsonb_agg(
                jsonb_build_object(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'quantity', oi.quantity,
                    'size', oi.size,
                    'price', oi.price,
                    'product', jsonb_build_object(
                        'id', p.id,
                        'name', p.name,
                        'description', p.description,
                        'images', p.images,
                        'category', p.category
                    )
                )
            ) as items
        FROM order_items oi
        LEFT JOIN products p ON p.id = oi.product_id
        GROUP BY oi.order_id
    ),
    user_info_json AS (
        SELECT 
            p.id as user_id,
            jsonb_build_object(
                'full_name', p.full_name,
                'email', p.email,
                'avatar_url', p.avatar_url
            ) as user_info
        FROM profiles p
    )
    SELECT 
        o.id,
        o.user_id,
        o.status,
        o.payment_status,
        o.payment_method,
        o.shipping_method,
        o.shipping_address,
        o.tracking_number,
        o.tracking_url,
        o.subtotal,
        o.shipping_fee,
        o.total,
        o.notes,
        o.created_at,
        o.updated_at,
        COALESCE(oij.items, '[]'::jsonb) as items,
        COALESCE(ui.user_info, '{}'::jsonb) as user_info,
        COUNT(*) OVER() as total_count
    FROM orders o
    LEFT JOIN order_items_json oij ON oij.order_id = o.id
    LEFT JOIN user_info_json ui ON ui.user_id = o.user_id
    WHERE 
        -- Only show orders if user is admin or owns the order
        (v_is_admin OR o.user_id = v_user_id)
        AND
        CASE 
            WHEN status_filter IS NOT NULL THEN o.status = status_filter
            ELSE TRUE
        END
    ORDER BY o.created_at DESC
    LIMIT items_per_page
    OFFSET (page_number - 1) * items_per_page;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_orders_with_items TO authenticated;

-- Recreate admin dashboard stats view
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
WITH order_stats AS (
    SELECT
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        SUM(total) as total_revenue
    FROM orders
),
user_stats AS (
    SELECT COUNT(*) as total_users
    FROM auth.users
),
product_stats AS (
    SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN stock_quantity < 10 THEN 1 END) as low_stock_products
    FROM products
)
SELECT
    o.total_orders,
    o.pending_orders,
    o.processing_orders,
    o.shipped_orders,
    o.delivered_orders,
    o.cancelled_orders,
    o.total_revenue,
    u.total_users,
    p.total_products,
    p.low_stock_products
FROM order_stats o
CROSS JOIN user_stats u
CROSS JOIN product_stats p;

-- Grant access to the view
GRANT SELECT ON public.admin_dashboard_stats TO authenticated;

-- Create function to handle order creation in a transaction
CREATE OR REPLACE FUNCTION public.create_order(
    p_user_id UUID,
    p_product_id UUID,
    p_quantity INTEGER,
    p_size TEXT,
    p_shipping_address JSONB,
    p_payment_method TEXT DEFAULT 'stripe',
    p_shipping_method TEXT DEFAULT 'standard'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_product_price NUMERIC;
    v_product_stock INTEGER;
    v_order_id UUID;
    v_subtotal NUMERIC;
    v_shipping_fee NUMERIC DEFAULT 0;
    v_total NUMERIC;
BEGIN
    -- Start transaction
    BEGIN
        -- Check if product exists and get price
        SELECT price, stock_quantity 
        INTO v_product_price, v_product_stock
        FROM products 
        WHERE id = p_product_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product not found';
        END IF;

        -- Check if size is valid
        IF NOT (p_size = ANY(SELECT UNNEST(sizes) FROM products WHERE id = p_product_id)) THEN
            RAISE EXCEPTION 'Invalid size selected';
        END IF;

        -- Check stock quantity
        IF v_product_stock < p_quantity THEN
            RAISE EXCEPTION 'Insufficient stock. Only % items available', v_product_stock;
        END IF;

        -- Calculate totals
        v_subtotal := v_product_price * p_quantity;
        v_total := v_subtotal + v_shipping_fee;

        -- Create order
        INSERT INTO orders (
            user_id,
            status,
            payment_status,
            payment_method,
            shipping_method,
            shipping_address,
            subtotal,
            shipping_fee,
            total
        ) VALUES (
            p_user_id,
            'pending',
            'pending',
            p_payment_method,
            p_shipping_method,
            p_shipping_address,
            v_subtotal,
            v_shipping_fee,
            v_total
        ) RETURNING id INTO v_order_id;

        -- Create order item
        INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            size,
            price
        ) VALUES (
            v_order_id,
            p_product_id,
            p_quantity,
            p_size,
            v_product_price
        );

        -- Update product stock
        UPDATE products 
        SET stock_quantity = stock_quantity - p_quantity
        WHERE id = p_product_id;

        -- Return the order ID
        RETURN v_order_id;
    EXCEPTION WHEN OTHERS THEN
        -- Rollback will happen automatically
        RAISE;
    END;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_order TO authenticated;

-- Create function to update order status (add this before the admin_dashboard_stats view)
CREATE OR REPLACE FUNCTION public.update_order_status(
    order_id uuid,
    new_status text
)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id uuid;
    v_is_admin boolean;
    v_order_exists boolean;
BEGIN
    -- Get the current user's ID
    v_user_id := auth.uid();
    
    -- Check if the user is an admin
    SELECT EXISTS (
        SELECT 1 FROM admin_users WHERE user_id = v_user_id
    ) INTO v_is_admin;
    
    -- If not admin, raise exception
    IF NOT v_is_admin THEN
        RAISE EXCEPTION 'Only administrators can update order status';
    END IF;
    
    -- Check if order exists
    SELECT EXISTS (
        SELECT 1 FROM orders WHERE id = order_id
    ) INTO v_order_exists;
    
    -- If order doesn't exist, raise exception
    IF NOT v_order_exists THEN
        RAISE EXCEPTION 'Order not found';
    END IF;
    
    -- Validate status
    IF new_status NOT IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid order status';
    END IF;
    
    -- Update the order status
    UPDATE orders
    SET 
        status = new_status,
        updated_at = now()
    WHERE id = order_id;
    
    RETURN true;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_order_status TO authenticated; 