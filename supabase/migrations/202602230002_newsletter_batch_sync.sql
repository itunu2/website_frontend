alter table public.newsletter_subscribers
  add column if not exists sync_batch_id uuid,
  add column if not exists substack_sync_queued_at timestamptz;

create index if not exists idx_newsletter_subscribers_pending_sync
  on public.newsletter_subscribers (substack_synced, sync_batch_id, subscribed_at desc);

create index if not exists idx_newsletter_subscribers_sync_batch_id
  on public.newsletter_subscribers (sync_batch_id);
