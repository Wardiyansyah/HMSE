-- Debug and fix authentication issues
BEGIN;

-- Check if profiles table exists and has correct structure
DO $$
BEGIN
    -- Ensure profiles table exists with all required columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        CREATE TABLE profiles (
            id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
            email TEXT NOT NULL,
            full_name TEXT,
            username TEXT UNIQUE,
            role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
            avatar_url TEXT,
            phone TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;

    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'username') THEN
        ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
        ALTER TABLE profiles ADD COLUMN full_name TEXT;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Update the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_email TEXT;
    user_full_name TEXT;
    user_username TEXT;
    user_role TEXT;
BEGIN
    -- Extract data from metadata
    user_email := COALESCE(new.email, '');
    user_full_name := COALESCE(new.raw_user_meta_data->>'full_name', '');
    user_username := COALESCE(new.raw_user_meta_data->>'username', '');
    user_role := COALESCE(new.raw_user_meta_data->>'role', 'student');

    -- Log the attempt
    RAISE LOG 'Creating profile for user: % with email: % username: % role: %', 
              new.id, user_email, user_username, user_role;

    -- Insert the profile
    INSERT INTO public.profiles (id, email, full_name, username, role, created_at, updated_at)
    VALUES (
        new.id,
        user_email,
        user_full_name,
        user_username,
        user_role,
        NOW(),
        NOW()
    );

    RAISE LOG 'Profile created successfully for user: %', new.id;
    RETURN new;

EXCEPTION
    WHEN unique_violation THEN
        RAISE LOG 'Username or email already exists for user: %', new.id;
        RETURN new;
    WHEN others THEN
        RAISE LOG 'Error in handle_new_user for user %: %', new.id, SQLERRM;
        RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Clear existing RLS policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Allow public username lookup" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies
-- Allow public read access (needed for username lookup during login)
CREATE POLICY "Allow public read access" ON profiles
    FOR SELECT USING (true);

-- Allow service role to do everything (for admin operations)
CREATE POLICY "Allow service role full access" ON profiles
    FOR ALL USING (current_setting('role') = 'service_role');

-- Allow authenticated users to insert their own profile
CREATE POLICY "Allow authenticated insert own profile" ON profiles
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Allow users update own profile" ON profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Allow anonymous users to insert profiles (needed for signup)
CREATE POLICY "Allow anon insert profiles" ON profiles
    FOR INSERT TO anon
    WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON profiles TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to profiles
DROP TRIGGER IF EXISTS handle_updated_at ON profiles;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

COMMIT;

-- Display current profiles for debugging
SELECT 'Current profiles:' as info;
SELECT id, email, username, role, created_at FROM profiles ORDER BY created_at DESC LIMIT 10;
