-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  website text,
  role text default 'student' not null, -- Added role column
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select using (true);

create policy "Users can insert their own profile."
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Auth.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, email, role)
  values (new.id, new.email, new.email, 'student'); -- Default role to 'student'
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Optional: Add email column to profiles table if you want to store it there
alter table profiles add column email text;
