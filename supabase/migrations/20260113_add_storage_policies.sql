-- Storage policies for assets/public/private + approvals
-- Paths follow: {agency_id}/{client_id}/{type}/{filename}

alter table storage.objects enable row level security;

drop policy if exists "assets_public_read" on storage.objects;
drop policy if exists "assets_public_rw" on storage.objects;
drop policy if exists "assets_private_rw" on storage.objects;
drop policy if exists "approvals_rw" on storage.objects;

create policy "assets_public_read"
on storage.objects
for select
using (bucket_id = 'assets-public');

create policy "assets_public_rw"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'assets-public'
  and (
    exists (
      select 1
      from public.clients c
      where c.id::text = split_part(name, '/', 2)
        and c.agency_id::text = split_part(name, '/', 1)
        and c.agency_id = public.user_agency_id()
    )
    or exists (
      select 1
      from public.clients c
      join public.clients_users cu on cu.client_id = c.id
      where cu.user_id = auth.uid()
        and c.id::text = split_part(name, '/', 2)
        and c.agency_id::text = split_part(name, '/', 1)
    )
  )
)
with check (
  bucket_id = 'assets-public'
  and (
    exists (
      select 1
      from public.clients c
      where c.id::text = split_part(name, '/', 2)
        and c.agency_id::text = split_part(name, '/', 1)
        and c.agency_id = public.user_agency_id()
    )
    or exists (
      select 1
      from public.clients c
      join public.clients_users cu on cu.client_id = c.id
      where cu.user_id = auth.uid()
        and c.id::text = split_part(name, '/', 2)
        and c.agency_id::text = split_part(name, '/', 1)
    )
  )
);

create policy "assets_private_rw"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'assets-private'
  and (
    exists (
      select 1
      from public.clients c
      where c.id::text = split_part(name, '/', 2)
        and c.agency_id::text = split_part(name, '/', 1)
        and c.agency_id = public.user_agency_id()
    )
    or exists (
      select 1
      from public.clients c
      join public.clients_users cu on cu.client_id = c.id
      where cu.user_id = auth.uid()
        and c.id::text = split_part(name, '/', 2)
        and c.agency_id::text = split_part(name, '/', 1)
    )
  )
)
with check (
  bucket_id = 'assets-private'
  and (
    exists (
      select 1
      from public.clients c
      where c.id::text = split_part(name, '/', 2)
        and c.agency_id::text = split_part(name, '/', 1)
        and c.agency_id = public.user_agency_id()
    )
    or exists (
      select 1
      from public.clients c
      join public.clients_users cu on cu.client_id = c.id
      where cu.user_id = auth.uid()
        and c.id::text = split_part(name, '/', 2)
        and c.agency_id::text = split_part(name, '/', 1)
    )
  )
);

create policy "approvals_rw"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'approvals'
  and (
    exists (
      select 1
      from public.clients c
      where c.id::text = split_part(name, '/', 2)
        and c.agency_id::text = split_part(name, '/', 1)
        and c.agency_id = public.user_agency_id()
    )
    or exists (
      select 1
      from public.clients c
      join public.clients_users cu on cu.client_id = c.id
      where cu.user_id = auth.uid()
        and c.id::text = split_part(name, '/', 2)
        and c.agency_id::text = split_part(name, '/', 1)
    )
  )
)
with check (
  bucket_id = 'approvals'
  and (
    exists (
      select 1
      from public.clients c
      where c.id::text = split_part(name, '/', 2)
        and c.agency_id::text = split_part(name, '/', 1)
        and c.agency_id = public.user_agency_id()
    )
    or exists (
      select 1
      from public.clients c
      join public.clients_users cu on cu.client_id = c.id
      where cu.user_id = auth.uid()
        and c.id::text = split_part(name, '/', 2)
        and c.agency_id::text = split_part(name, '/', 1)
    )
  )
);
