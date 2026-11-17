insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('company-logos','company-logos',true,2000000,array['image/png','image/jpeg','image/webp']) on conflict(id) do nothing;
create policy company_logo_public_read on storage.objects for select using(bucket_id='company-logos');
create policy company_logo_admin_insert on storage.objects for insert to authenticated with check(bucket_id='company-logos' and public.is_admin());
create policy company_logo_admin_delete on storage.objects for delete to authenticated using(bucket_id='company-logos' and public.is_admin());
