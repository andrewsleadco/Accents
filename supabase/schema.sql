-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Table: courses
create table if not exists courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  created_by uuid not null references auth.users on delete cascade,
  created_at timestamp with time zone default now()
);

-- Table: lessons
create table if not exists lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  content text,
  order_index int not null default 0,
  created_at timestamp with time zone default now()
);

-- RLS: Enable and enforce
alter table courses enable row level security;
alter table lessons enable row level security;

-- Policy: Courses - owner can read/write
create policy "Allow course access to owner"
  on courses for all
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- Policy: Lessons - linked to owner via course
create policy "Allow lesson access via course owner"
  on lessons for all
  using (
    exists (
      select 1 from courses
      where courses.id = lessons.course_id
      and courses.created_by = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from courses
      where courses.id = lessons.course_id
      and courses.created_by = auth.uid()
    )
  );