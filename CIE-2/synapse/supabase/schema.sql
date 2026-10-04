-- ============================================================
-- Synapse Database Schema
-- Run this in: Supabase SQL Editor > New Query
-- ============================================================

-- 1. FOLDERS
create table if not exists folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  parent_id uuid references folders(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 2. TAGS
create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  unique (user_id, name)
);

-- 3. NOTES (ideas and full notes share one table)
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references notes(id) on delete set null,
  title text not null default '',
  content jsonb,                        -- Tiptap JSON
  content_text text not null default '', -- plain text for search
  status text not null default 'inbox'
    check (status in ('inbox', 'note', 'archived', 'trashed')),
  is_pinned boolean not null default false,
  folder_id uuid references folders(id) on delete set null,
  is_public boolean not null default false,
  share_slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content_text, '')), 'B')
  ) stored
);

create index if not exists notes_search_idx on notes using gin (search);
create index if not exists notes_user_idx on notes (user_id, updated_at desc);
create index if not exists notes_status_idx on notes (user_id, status, created_at desc);
create index if not exists notes_share_idx on notes (share_slug) where is_public = true;

-- 4. NOTE_TAGS
create table if not exists note_tags (
  note_id uuid references notes(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (note_id, tag_id)
);

-- 5. NOTE_LINKS (powers backlinks + graph)
create table if not exists note_links (
  source_id uuid references notes(id) on delete cascade,
  target_id uuid references notes(id) on delete cascade,
  kind text not null default 'wikilink'
    check (kind in ('wikilink', 'manual', 'merged_from')),
  created_at timestamptz not null default now(),
  primary key (source_id, target_id, kind)
);

-- 6. PROFILES (username + display name per user)
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null,
  display_name  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9_]{3,20}$')
);

create index if not exists profiles_username_idx on profiles (username);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table folders enable row level security;
alter table tags enable row level security;
alter table notes enable row level security;
alter table note_tags enable row level security;
alter table note_links enable row level security;
alter table profiles enable row level security;

-- FOLDERS
create policy "Users can manage their own folders"
  on folders for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- TAGS
create policy "Users can manage their own tags"
  on tags for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- NOTES: private notes (owner only)
create policy "Users can manage their own notes"
  on notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- NOTES: public notes readable by anyone (including anon)
create policy "Public notes are readable by everyone"
  on notes for select
  using (is_public = true);

-- NOTE_TAGS (check ownership through the parent note)
create policy "Users can manage tags for their own notes"
  on note_tags for all
  using (
    exists (
      select 1 from notes
      where notes.id = note_tags.note_id
        and notes.user_id = auth.uid()
    )
  );

-- NOTE_LINKS (check ownership through the source note)
create policy "Users can manage links for their own notes"
  on note_links for all
  using (
    exists (
      select 1 from notes
      where notes.id = note_links.source_id
        and notes.user_id = auth.uid()
    )
  );

-- PROFILES: anyone can read (for public note author display)
create policy "Profiles are publicly readable"
  on profiles for select
  using (true);

-- PROFILES: only owner can write
create policy "Users can manage their own profile"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- AUTO-UPDATE updated_at on notes
-- ============================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger notes_updated_at
  before update on notes
  for each row
  execute procedure update_updated_at_column();

create trigger profiles_updated_at
  before update on profiles
  for each row
  execute procedure update_updated_at_column();

-- ============================================================
-- MIGRATION: if notes table already exists, add new columns
-- ============================================================
-- Run this block if you already ran the original schema:
--
-- alter table notes add column if not exists is_public boolean not null default false;
-- alter table notes add column if not exists share_slug text unique;
-- create index if not exists notes_share_idx on notes (share_slug) where is_public = true;
--
-- create table if not exists profiles (
--   id uuid primary key references auth.users(id) on delete cascade,
--   username text unique not null,
--   display_name text,
--   created_at timestamptz not null default now(),
--   updated_at timestamptz not null default now(),
--   constraint username_format check (username ~ '^[a-z0-9_]{3,20}$')
-- );
-- create index if not exists profiles_username_idx on profiles (username);
-- alter table profiles enable row level security;
-- create policy "Profiles are publicly readable" on profiles for select using (true);
-- create policy "Users can manage their own profile" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
