-- supabase/schema.sql

-- Enable uuid generation
create extension if not exists "uuid-ossp";

-- Courses table
create table if not exists courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  created_by uuid references auth.users not null,
  created_at timestamp with time zone default now()
);

-- Lessons table
create table if not exists lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  content text,
  order_index int,
  created_at timestamp with time zone default now()
);
