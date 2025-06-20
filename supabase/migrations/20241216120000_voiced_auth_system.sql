-- supabase/migrations/20241216120000_voiced_auth_system.sql
-- Voiced Authentication System with User Tiers

-- 1. Create user tier enum
CREATE TYPE public.user_tier AS ENUM ('free', 'national');

-- 2. Create user profiles table as intermediary
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    tier public.user_tier DEFAULT 'free'::public.user_tier,
    zip_code TEXT,
    phone_number TEXT,
    sms_notifications BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create subscription tracking table
CREATE TABLE public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    tier public.user_tier NOT NULL,
    price_paid DECIMAL(10,2),
    payment_method TEXT,
    stripe_subscription_id TEXT,
    status TEXT DEFAULT 'active',
    starts_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create polls table for tier-based access
CREATE TABLE public.polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    requires_tier public.user_tier DEFAULT 'free'::public.user_tier,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ
);

-- 5. Create articles table for tier-based access
CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    requires_tier public.user_tier DEFAULT 'national'::public.user_tier,
    is_published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create essential indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_tier ON public.user_profiles(tier);
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_polls_created_by ON public.polls(created_by);
CREATE INDEX idx_polls_requires_tier ON public.polls(requires_tier);
CREATE INDEX idx_articles_author_id ON public.articles(author_id);
CREATE INDEX idx_articles_requires_tier ON public.articles(requires_tier);

-- 7. Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 8. Helper functions for RLS policies
CREATE OR REPLACE FUNCTION public.get_user_tier(user_uuid UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT COALESCE(
    (SELECT up.tier::TEXT FROM public.user_profiles up WHERE up.id = user_uuid),
    'free'
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_tier_content(required_tier TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT CASE 
    WHEN required_tier = 'free' THEN true
    WHEN required_tier = 'national' AND public.get_user_tier(auth.uid()) = 'national' THEN true
    ELSE false
END
$$;

-- 9. Create trigger function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    email, 
    full_name, 
    tier,
    zip_code,
    phone_number,
    sms_notifications,
    email_notifications
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'tier')::public.user_tier, 'free'::public.user_tier),
    NEW.raw_user_meta_data->>'zip_code',
    NEW.raw_user_meta_data->>'phone_number',
    COALESCE((NEW.raw_user_meta_data->>'sms_notifications')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'email_notifications')::boolean, true)
  );
  RETURN NEW;
END;
$$;

-- 10. Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. RLS Policies
-- User profiles: users can view and edit their own profile
CREATE POLICY "users_own_profile"
ON public.user_profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- User subscriptions: users can view their own subscriptions
CREATE POLICY "users_own_subscriptions"
ON public.user_subscriptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Polls: tier-based access
CREATE POLICY "tier_based_poll_access"
ON public.polls
FOR SELECT
TO authenticated
USING (public.can_access_tier_content(requires_tier::TEXT));

-- Articles: tier-based access
CREATE POLICY "tier_based_article_access"
ON public.articles
FOR SELECT
TO authenticated
USING (public.can_access_tier_content(requires_tier::TEXT));

-- Public poll viewing for free content
CREATE POLICY "public_free_polls"
ON public.polls
FOR SELECT
TO public
USING (requires_tier = 'free'::public.user_tier AND is_active = true);

-- 12. Complete mock data with auth users
DO $$
DECLARE
    free_user_id UUID := gen_random_uuid();
    national_user_id UUID := gen_random_uuid();
    admin_user_id UUID := gen_random_uuid();
BEGIN
    -- Create complete auth.users records
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (free_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'free@voiced.gov', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Free User", "tier": "free", "zip_code": "12345"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (national_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'national@voiced.gov', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "National User", "tier": "national", "zip_code": "67890"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (admin_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@voiced.gov', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "tier": "national", "zip_code": "54321"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create subscription for national user
    INSERT INTO public.user_subscriptions (user_id, tier, price_paid, payment_method, status)
    VALUES (national_user_id, 'national'::public.user_tier, 5.00, 'stripe', 'active');

    -- Create sample polls
    INSERT INTO public.polls (title, description, created_by, requires_tier, is_active)
    VALUES 
        ('Local Infrastructure Poll', 'What infrastructure improvements does your community need most?', admin_user_id, 'free'::public.user_tier, true),
        ('National Policy Survey', 'Comprehensive survey on federal policy priorities', admin_user_id, 'national'::public.user_tier, true),
        ('Community Safety Poll', 'Rate the safety measures in your neighborhood', admin_user_id, 'free'::public.user_tier, true);

    -- Create sample articles
    INSERT INTO public.articles (title, content, author_id, requires_tier, is_published, featured)
    VALUES 
        ('Understanding Local Government', 'A comprehensive guide to how local government works and how you can get involved...', admin_user_id, 'free'::public.user_tier, true, true),
        ('Deep Dive: Federal Budget Analysis', 'An in-depth analysis of the federal budget and its impact on local communities...', admin_user_id, 'national'::public.user_tier, true, false),
        ('Civic Engagement Best Practices', 'Learn the most effective ways to engage with your representatives...', admin_user_id, 'national'::public.user_tier, true, true);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;