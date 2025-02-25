-- Drop existing objects to start fresh
DROP FUNCTION IF EXISTS public.get_users_with_roles CASCADE;
DROP VIEW IF EXISTS public.user_management CASCADE;

-- Create a view for user management that includes admin status
CREATE OR REPLACE VIEW public.user_management AS
SELECT 
    au.id,
    au.email,
    au.created_at,
    p.full_name,
    p.avatar_url,
    COALESCE(admin.role, 'user') as user_role,
    admin.user_id IS NOT NULL as is_admin,
    COUNT(*) OVER() as total_count
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
LEFT JOIN public.admin_users admin ON au.id = admin.user_id;

-- Grant access to the view
GRANT SELECT ON public.user_management TO authenticated;

-- Create function to get users with roles and pagination
CREATE OR REPLACE FUNCTION public.get_users_with_roles(
    page_number integer DEFAULT 1,
    items_per_page integer DEFAULT 10
)
RETURNS SETOF public.user_management  -- Return the exact structure of the view
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id uuid;
    v_user_role text;
BEGIN
    -- Get the current user's ID
    v_user_id := auth.uid();
    
    -- Get the current user's role
    SELECT admin.role INTO v_user_role
    FROM admin_users admin
    WHERE admin.user_id = v_user_id;

    -- Raise detailed error if user is not an admin
    IF v_user_role IS NULL THEN
        RAISE EXCEPTION 'Access denied: User % is not an admin', v_user_id;
    END IF;

    -- Log the request
    RAISE NOTICE 'User % (role: %) requesting users list, page: %, items: %',
        v_user_id, v_user_role, page_number, items_per_page;

    RETURN QUERY
    SELECT *
    FROM user_management
    ORDER BY 
        CASE WHEN user_role = 'super_admin' THEN 1
             WHEN user_role = 'admin' THEN 2
             ELSE 3 
        END,
        created_at DESC
    LIMIT items_per_page
    OFFSET ((page_number - 1) * items_per_page);

    -- Log the completion
    RAISE NOTICE 'Query completed successfully';
END;
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.get_users_with_roles TO authenticated;

-- Test queries to verify the structure
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Test the view structure
    RAISE NOTICE 'Verifying user_management view structure:';
    FOR r IN (
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'user_management'
        ORDER BY ordinal_position
    ) LOOP
        RAISE NOTICE '% : %', r.column_name, r.data_type;
    END LOOP;

    -- Note about testing the function
    RAISE NOTICE E'\nNote: The get_users_with_roles function requires an authenticated admin user to test.';
    RAISE NOTICE 'Please test the function manually after setting up an admin user.';
    RAISE NOTICE 'Example usage:';
    RAISE NOTICE 'SELECT * FROM public.get_users_with_roles(1, 10);';
END;
$$; 