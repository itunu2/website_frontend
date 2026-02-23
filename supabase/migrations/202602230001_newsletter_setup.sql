create extension if not exists pgcrypto;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null check (source in ('popup', 'footer', 'blog-cta', 'home-cta')),
  status text not null default 'active' check (status in ('active', 'unsubscribed', 'bounced')),
  subscribed_at timestamptz not null default timezone('utc', now()),
  substack_synced boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint newsletter_subscribers_email_lowercase check (email = lower(email))
);

create index if not exists idx_newsletter_subscribers_source
  on public.newsletter_subscribers (source);

create index if not exists idx_newsletter_subscribers_subscribed_at
  on public.newsletter_subscribers (subscribed_at desc);

create or replace function public.set_newsletter_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_set_newsletter_updated_at on public.newsletter_subscribers;

create trigger trg_set_newsletter_updated_at
before update on public.newsletter_subscribers
for each row
execute function public.set_newsletter_updated_at();

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "newsletter_no_public_select" on public.newsletter_subscribers;
create policy "newsletter_no_public_select"
on public.newsletter_subscribers
for select
to anon, authenticated
using (false);
