-- Check all pet profiles with user information
SELECT 
    p.*,
    u.email as user_email,
    u.raw_user_meta_data->>'name' as user_name
FROM pet_profiles p
JOIN auth.users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- Check pet profiles for a specific user (replace USER_ID with actual UUID)
SELECT 
    p.*,
    u.email as user_email,
    u.raw_user_meta_data->>'name' as user_name
FROM pet_profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE p.user_id = 'USER_ID'
ORDER BY p.created_at DESC; 