-- Add the specified user as a super_admin
INSERT INTO public.admin_users (user_id, role)
VALUES ('8709ed65-6c11-4038-8f59-aef1bb9bdf90', 'super_admin')
ON CONFLICT (user_id) 
DO UPDATE SET 
    role = 'super_admin',
    updated_at = TIMEZONE('utc', NOW());

-- Verify admin status
SELECT * FROM public.admin_users WHERE user_id = '8709ed65-6c11-4038-8f59-aef1bb9bdf90'; 