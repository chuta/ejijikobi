-- Drop existing policies that depend on the functions
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- Drop existing objects to ensure clean setup
DROP FUNCTION IF EXISTS public.is_admin(UUID);
DROP FUNCTION IF EXISTS public.add_admin(UUID, TEXT);
DROP FUNCTION IF EXISTS public.remove_admin(UUID);
DROP TABLE IF EXISTS public.admin_users;

-- Create admin_users table
CREATE TABLE public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    role TEXT NOT NULL CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policies for admin_users table
CREATE POLICY "Admins can view admin_users"
    ON public.admin_users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE admin_users.user_id = $1
        AND role IN ('admin', 'super_admin')
    );
END;
$$;

-- Function to add an admin
CREATE OR REPLACE FUNCTION public.add_admin(
    target_user_id UUID,
    admin_role TEXT DEFAULT 'admin'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the executing user is a super_admin
    IF NOT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
        AND role = 'super_admin'
    ) THEN
        RAISE EXCEPTION 'Only super admins can add new admins';
    END IF;

    -- Add the new admin
    INSERT INTO public.admin_users (user_id, role, created_by)
    VALUES (target_user_id, admin_role, auth.uid())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        role = EXCLUDED.role,
        updated_at = TIMEZONE('utc', NOW());

    RETURN TRUE;
END;
$$;

-- Function to remove an admin
CREATE OR REPLACE FUNCTION public.remove_admin(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the executing user is a super_admin
    IF NOT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
        AND role = 'super_admin'
    ) THEN
        RAISE EXCEPTION 'Only super admins can remove admins';
    END IF;

    DELETE FROM public.admin_users WHERE user_id = target_user_id;
    RETURN TRUE;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_admin TO authenticated;
GRANT SELECT ON public.admin_users TO authenticated;

-- Create admin dashboard view
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM auth.users) as total_users,
    (SELECT COUNT(*) FROM public.products) as total_products,
    (SELECT COUNT(*) FROM public.orders) as total_orders,
    (SELECT COALESCE(SUM(total), 0) FROM public.orders) as total_revenue;

-- Grant access to the view
GRANT SELECT ON public.admin_dashboard_stats TO authenticated;

-- Recreate the products policy for admin access
CREATE POLICY "Admins can manage products"
    ON public.products
    USING (
        public.is_admin(auth.uid())
    )
    WITH CHECK (
        public.is_admin(auth.uid())
    ); 