-- Check all users and their onboarding status
SELECT 
    id,
    email,
    raw_user_meta_data->>'name' as name,
    raw_user_meta_data->>'onboardingCompleted' as onboarding_completed,
    raw_user_meta_data->>'premium' as premium,
    raw_user_meta_data->>'avatar' as avatar,
    raw_user_meta_data->>'credits' as credits,
    created_at,
    updated_at
FROM auth.users
ORDER BY created_at DESC;

-- Check users who haven't completed onboarding
SELECT 
    id,
    email,
    raw_user_meta_data->>'name' as name,
    created_at
FROM auth.users
WHERE raw_user_meta_data->>'onboardingCompleted' = 'false'
ORDER BY created_at DESC;

-- Check users who have completed onboarding
SELECT 
    id,
    email,
    raw_user_meta_data->>'name' as name,
    created_at
FROM auth.users
WHERE raw_user_meta_data->>'onboardingCompleted' = 'true'
ORDER BY created_at DESC; 