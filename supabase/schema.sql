-- Lärlabbet database (Supabase). Paste the whole file into Supabase → SQL Editor → Run. Safe to run again.
--
-- Who can do what:
--   * A parent signs up with email + password (Supabase Auth) and gets one family with a short family code.
--   * The parent adds children (name + 4-digit PIN). Children have no email: they log in with
--     family code + their name + PIN, through the functions below, and get a session token.
--   * A parent can read and change only their own family's children. A child's token reaches only that child.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.families (
  id         uuid primary key default gen_random_uuid(),
  owner      uuid not null unique references auth.users(id) on delete cascade,
  code       text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.kids (
  id           uuid primary key default gen_random_uuid(),
  family_id    uuid not null references public.families(id) on delete cascade,
  name         text not null check (char_length(name) between 2 and 30),
  pin_hash     text not null,
  grade        int  check (grade between 1 and 9),
  state        jsonb not null default '{}'::jsonb,
  upd          bigint not null default 0,
  fails        int not null default 0,
  locked_until timestamptz,
  created_at   timestamptz not null default now()
);
create unique index if not exists kids_family_name on public.kids (family_id, lower(name));

create table if not exists public.kid_sessions (
  token      text primary key,
  kid_id     uuid not null references public.kids(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.families     enable row level security;
alter table public.kids         enable row level security;
alter table public.kid_sessions enable row level security;   -- no policies: only the functions below touch it

drop policy if exists "own family" on public.families;
create policy "own family" on public.families for select using (owner = auth.uid());

-- parents read and update their children's progress directly; adding children and PINs go through functions
drop policy if exists "own kids read" on public.kids;
create policy "own kids read" on public.kids for select
  using (family_id in (select id from public.families where owner = auth.uid()));
drop policy if exists "own kids update" on public.kids;
create policy "own kids update" on public.kids for update
  using (family_id in (select id from public.families where owner = auth.uid()))
  with check (family_id in (select id from public.families where owner = auth.uid()));
drop policy if exists "own kids delete" on public.kids;
create policy "own kids delete" on public.kids for delete
  using (family_id in (select id from public.families where owner = auth.uid()));
-- pin_hash must never leave the database, even for the parent
revoke all on public.kids from anon, authenticated;
grant select (id, family_id, name, grade, state, upd, created_at) on public.kids to authenticated;
grant update (name, grade, state, upd) on public.kids to authenticated;
grant delete on public.kids to authenticated;
revoke all on public.kid_sessions from anon, authenticated;
revoke insert, update, delete on public.families from anon, authenticated;

-- ---------- parent functions (need a signed-in parent) ----------

-- the parent's family, created on first call with a 6-letter code (no 0/O/1/I to avoid mix-ups)
create or replace function public.my_family() returns public.families
language plpgsql security definer set search_path = public, extensions as $$
declare f public.families; c text; abc text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select * into f from families where owner = auth.uid();
  if found then return f; end if;
  loop
    c := '';
    for i in 1..6 loop c := c || substr(abc, 1 + floor(random() * length(abc))::int, 1); end loop;
    exit when not exists (select 1 from families where code = c);
  end loop;
  insert into families(owner, code) values (auth.uid(), c) returning * into f;
  return f;
end $$;

create or replace function public.add_kid(p_name text, p_pin text, p_grade int, p_state jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public, extensions as $$
declare f public.families; k uuid;
begin
  if p_pin !~ '^[0-9]{4}$' then raise exception 'PIN must be 4 digits'; end if;
  f := my_family();
  insert into kids(family_id, name, pin_hash, grade, state, upd)
    values (f.id, trim(p_name), crypt(p_pin, gen_salt('bf')), p_grade, coalesce(p_state, '{}'::jsonb),
            coalesce((p_state->>'upd')::bigint, 0))
    returning id into k;
  return k;
end $$;

create or replace function public.set_kid_pin(p_kid uuid, p_pin text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if p_pin !~ '^[0-9]{4}$' then raise exception 'PIN must be 4 digits'; end if;
  update kids set pin_hash = crypt(p_pin, gen_salt('bf')), fails = 0, locked_until = null
   where id = p_kid and family_id in (select id from families where owner = auth.uid());
  if not found then raise exception 'not your child'; end if;
end $$;

-- ---------- child functions (no account; family code + name + PIN gives a token) ----------

-- after 5 wrong PINs the child is locked for 10 minutes
create or replace function public.kid_login(p_code text, p_name text, p_pin text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare k public.kids; t text;
begin
  select kids.* into k from kids join families on families.id = kids.family_id
   where families.code = upper(trim(p_code)) and lower(kids.name) = lower(trim(p_name));
  if not found then return jsonb_build_object('error', 'unknown'); end if;
  if k.locked_until is not null and k.locked_until > now() then return jsonb_build_object('error', 'locked'); end if;
  if k.pin_hash <> crypt(p_pin, k.pin_hash) then
    update kids set fails = fails + 1,
      locked_until = case when fails + 1 >= 5 then now() + interval '10 minutes' else null end
     where id = k.id;
    return jsonb_build_object('error', 'pin');
  end if;
  update kids set fails = 0, locked_until = null where id = k.id;
  t := encode(gen_random_bytes(24), 'hex');
  insert into kid_sessions(token, kid_id) values (t, k.id);
  return jsonb_build_object('token', t, 'id', k.id, 'name', k.name, 'grade', k.grade, 'state', k.state, 'upd', k.upd);
end $$;

create or replace function public.kid_load(p_token text) returns jsonb
language sql security definer set search_path = public as $$
  select jsonb_build_object('id', k.id, 'name', k.name, 'grade', k.grade, 'state', k.state, 'upd', k.upd)
    from kid_sessions s join kids k on k.id = s.kid_id where s.token = p_token;
$$;

create or replace function public.kid_save(p_token text, p_state jsonb, p_upd bigint) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if octet_length(p_state::text) > 400000 then raise exception 'too big'; end if;
  update kids set state = p_state, upd = p_upd, grade = coalesce((p_state->>'grade')::int, grade)
   where id = (select kid_id from kid_sessions where token = p_token);
  return found;
end $$;

create or replace function public.kid_logout(p_token text) returns void
language sql security definer set search_path = public as $$
  delete from kid_sessions where token = p_token;
$$;

revoke all on function public.my_family(), public.add_kid(text,text,int,jsonb), public.set_kid_pin(uuid,text) from anon, public;
grant execute on function public.my_family(), public.add_kid(text,text,int,jsonb), public.set_kid_pin(uuid,text) to authenticated;
grant execute on function public.kid_login(text,text,text), public.kid_load(text), public.kid_save(text,jsonb,bigint), public.kid_logout(text) to anon, authenticated;
