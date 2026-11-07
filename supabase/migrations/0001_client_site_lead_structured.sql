-- =====================================================================
-- Demandes du site Gulf Bridge Sourcing : champs structurés et pièces
-- jointes. NON APPLIQUÉE. Voir supabase/README.md.
--
-- Projet visé : backend partagé de la console Atlas Studio. L'ancienne
-- signature de submit_client_site_lead est conservée telle quelle, pour
-- que les autres sites clients continuent de fonctionner.
-- =====================================================================

begin;

-- 1. Colonnes structurées -------------------------------------------------

alter table public.client_site_leads
  add column if not exists ref            text,
  add column if not exists specialty      text,
  add column if not exists country         text,
  add column if not exists products        text,
  add column if not exists need_date       date,
  add column if not exists supplier_name   text,
  add column if not exists contact_role    text,
  add column if not exists source          text,
  add column if not exists landing_page    text,
  add column if not exists attachments     jsonb not null default '[]'::jsonb;

create unique index if not exists client_site_leads_ref_key
  on public.client_site_leads (ref) where ref is not null;

create index if not exists client_site_leads_site_specialty_idx
  on public.client_site_leads (site_id, specialty);

-- Bornes de longueur et de forme, vérifiées en base.
alter table public.client_site_leads
  drop constraint if exists client_site_leads_structured_chk;
alter table public.client_site_leads
  add constraint client_site_leads_structured_chk check (
        (ref            is null or char_length(ref)            <= 32)
    and (specialty      is null or char_length(specialty)      <= 120)
    and (country        is null or char_length(country)        <= 120)
    and (products       is null or char_length(products)       <= 5000)
    and (supplier_name  is null or char_length(supplier_name)  <= 200)
    and (contact_role   is null or char_length(contact_role)   <= 200)
    and (source         is null or char_length(source)         <= 120)
    and (landing_page   is null or char_length(landing_page)   <= 300)
    and jsonb_typeof(attachments) = 'array'
    and jsonb_array_length(attachments) <= 5
  );

-- 2. Nouvelle surcharge de la RPC ----------------------------------------
-- Les paramètres ajoutés ont une valeur par défaut : un appel à l'ancienne
-- signature reste valide et continue de viser l'ancienne fonction.

create or replace function public.submit_client_site_lead(
  p_site_id       text,
  p_name          text,
  p_email         text,
  p_company       text,
  p_phone         text,
  p_service       text,
  p_message       text,
  p_page          text,
  p_ref           text default null,
  p_specialty     text default null,
  p_country       text default null,
  p_products      text default null,
  p_need_date     text default null,
  p_supplier_name text default null,
  p_contact_role  text default null,
  p_source        text default null,
  p_landing_page  text default null,
  p_attachments   jsonb default '[]'::jsonb
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id   uuid;
  v_date date;
begin
  -- Le site doit exister et être actif.
  if not exists (select 1 from public.client_sites s where s.id = p_site_id and s.status = 'active') then
    raise exception 'site inconnu' using errcode = '22023';
  end if;

  -- Validation par schéma, avant écriture.
  if coalesce(char_length(btrim(p_name)), 0) < 2 or char_length(p_name) > 200 then
    raise exception 'nom invalide' using errcode = '22023';
  end if;
  if p_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[A-Za-z]{2,}$' or char_length(p_email) > 254 then
    raise exception 'adresse e-mail invalide' using errcode = '22023';
  end if;
  if coalesce(char_length(p_phone), 0) > 50 then
    raise exception 'numéro invalide' using errcode = '22023';
  end if;
  if coalesce(char_length(p_message), 0) > 20000 then
    raise exception 'message trop long' using errcode = '22023';
  end if;
  if p_attachments is null or jsonb_typeof(p_attachments) <> 'array'
     or jsonb_array_length(p_attachments) > 5 then
    raise exception 'pièces jointes invalides' using errcode = '22023';
  end if;
  -- Les pièces jointes ne portent qu'un chemin, un nom et une taille.
  if exists (
    select 1 from jsonb_array_elements(p_attachments) a
    where jsonb_typeof(a) <> 'object'
       or (a - array['path','name','size']) <> '{}'::jsonb
       or coalesce(char_length(a->>'path'), 0) not between 1 and 400
       or coalesce(char_length(a->>'name'), 0) not between 1 and 300
  ) then
    raise exception 'pièces jointes invalides' using errcode = '22023';
  end if;

  begin
    v_date := nullif(btrim(coalesce(p_need_date, '')), '')::date;
  exception when others then
    raise exception 'date invalide' using errcode = '22023';
  end;

  -- Limitation de débit : 5 demandes par heure et par adresse e-mail.
  if (
    select count(*) from public.client_site_leads l
    where l.site_id = p_site_id and lower(l.email) = lower(p_email)
      and l.created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'trop de demandes' using errcode = '54000';
  end if;

  insert into public.client_site_leads (
    site_id, name, company, email, phone, service, message, page,
    ref, specialty, country, products, need_date, supplier_name,
    contact_role, source, landing_page, attachments
  ) values (
    p_site_id, btrim(p_name), nullif(btrim(coalesce(p_company, '')), ''), lower(btrim(p_email)),
    nullif(btrim(coalesce(p_phone, '')), ''), nullif(btrim(coalesce(p_service, '')), ''),
    nullif(btrim(coalesce(p_message, '')), ''), nullif(btrim(coalesce(p_page, '')), ''),
    nullif(btrim(coalesce(p_ref, '')), ''), nullif(btrim(coalesce(p_specialty, '')), ''),
    nullif(btrim(coalesce(p_country, '')), ''), nullif(btrim(coalesce(p_products, '')), ''),
    v_date, nullif(btrim(coalesce(p_supplier_name, '')), ''),
    nullif(btrim(coalesce(p_contact_role, '')), ''), nullif(btrim(coalesce(p_source, '')), ''),
    nullif(btrim(coalesce(p_landing_page, '')), ''), p_attachments
  ) returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_client_site_lead(
  text, text, text, text, text, text, text, text,
  text, text, text, text, text, text, text, text, text, jsonb
) from public;
grant execute on function public.submit_client_site_lead(
  text, text, text, text, text, text, text, text,
  text, text, text, text, text, text, text, text, text, jsonb
) to anon, authenticated;

-- 3. Stockage privé des pièces jointes -----------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'client-site-lead-files', 'client-site-lead-files', false, 10485760,
  array[
    'application/pdf', 'image/jpeg', 'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Aucun droit pour anon : ni lecture, ni écriture, ni liste. L'écriture passe
-- par la fonction client-site-upload, qui détient la clé de service. La
-- lecture par l'équipe se fait par URL signée, de durée limitée.
drop policy if exists "lead files anon read"  on storage.objects;
drop policy if exists "lead files anon write" on storage.objects;

-- 4. Purge des fichiers des demandes sans suite --------------------------
-- Section 13 du cahier des charges : douze mois.

create or replace function public.purge_client_site_lead_files()
returns integer
language plpgsql
security definer
set search_path = public, storage, pg_temp
as $$
declare
  v_count integer := 0;
begin
  with stale as (
    select l.id, a->>'path' as p
    from public.client_site_leads l
    cross join lateral jsonb_array_elements(l.attachments) a
    where l.created_at < now() - interval '12 months'
      and l.status in ('new', 'archived')
  ), gone as (
    delete from storage.objects o
    using stale
    where o.bucket_id = 'client-site-lead-files' and o.name = stale.p
    returning 1
  )
  select count(*) into v_count from gone;

  update public.client_site_leads
     set attachments = '[]'::jsonb
   where created_at < now() - interval '12 months'
     and status in ('new', 'archived')
     and attachments <> '[]'::jsonb;

  return v_count;
end;
$$;

revoke all on function public.purge_client_site_lead_files() from public, anon, authenticated;

commit;
