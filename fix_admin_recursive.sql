-- First, drop ALL existing policies
DROP POLICY IF EXISTS "admin_users_select_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_insert_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_update_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_delete_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_policy" ON admin_users;
DROP POLICY IF EXISTS "admin_users_select" ON admin_users;
DROP POLICY IF EXISTS "admin_users_insert" ON admin_users;
DROP POLICY IF EXISTS "admin_users_update" ON admin_users;
DROP POLICY IF EXISTS "admin_users_delete" ON admin_users;
DROP POLICY IF EXISTS "orders_policy" ON orders;
DROP POLICY IF EXISTS "order_items_policy" ON order_items;

-- First, create a function to set user role in auth.users
CREATE OR REPLACE FUNCTION set_claim(uid uuid, claim text, value jsonb) 
RETURNS text 
LANGUAGE plpgsql SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = uid
  ) THEN
    RETURN 'User not found';
  END IF;

  UPDATE auth.users 
  SET raw_app_meta_data = 
    raw_app_meta_data || 
    json_build_object(claim, value)::jsonb
  WHERE id = uid;
  
  RETURN 'OK';
END;
$$;

-- Create a function to check if user is admin using claims
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS boolean 
LANGUAGE sql SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT 
    coalesce(
      auth.jwt() ->> 'role' = 'admin' OR
      (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin',
      false
    );
$$;

-- Create policy for admin_users table without recursion
CREATE POLICY "admin_users_select" ON admin_users
FOR SELECT USING (true);  -- Anyone can read admin status

CREATE POLICY "admin_users_insert" ON admin_users
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  (is_admin() OR NOT EXISTS (SELECT 1 FROM admin_users))  -- First user or admin can insert
);

CREATE POLICY "admin_users_update" ON admin_users
FOR UPDATE USING (
  auth.uid() = user_id OR is_admin()
);

CREATE POLICY "admin_users_delete" ON admin_users
FOR DELETE USING (
  auth.uid() = user_id OR is_admin()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Example of how to set admin role (run this for your admin users):
-- SELECT set_claim('user-uuid-here', 'role', '"admin"'); 