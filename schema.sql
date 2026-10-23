-- Arabiyyati database schema. Run this entire file in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_ar text not null default '',
  description text not null default '',
  level text not null default 'A1',
  icon text not null default 'book-open',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  arabic text not null,
  transliteration text not null default '',
  meaning_id text not null,
  word_type text not null default 'isim',
  gender text,
  form_accusative text,
  grammar_tags text[] not null default '{}',
  level text not null default 'A1',
  audio_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (topic_id, arabic, meaning_id)
);

create table if not exists public.dialogue_templates (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  title text not null,
  level text not null default 'A1',
  turns jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_type text not null default 'practice',
  score numeric not null default 0,
  total numeric not null default 0,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists vocabulary_topic_id_idx on public.vocabulary(topic_id);
create index if not exists learning_progress_user_created_idx on public.learning_progress(user_id, created_at desc);

-- Helper function avoids exposing profiles broadly when checking staff permissions.
create or replace function public.has_staff_role(allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = any(allowed_roles)
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'student')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.topics enable row level security;
alter table public.vocabulary enable row level security;
alter table public.dialogue_templates enable row level security;
alter table public.learning_progress enable row level security;

drop policy if exists "Profiles: read own or staff" on public.profiles;
create policy "Profiles: read own or staff" on public.profiles for select to authenticated
using (id = auth.uid() or public.has_staff_role(array['admin']));

-- Topics and vocabulary are public learning content. Only staff may mutate them.
drop policy if exists "Topics are readable" on public.topics;
create policy "Topics are readable" on public.topics for select to anon, authenticated using (true);
drop policy if exists "Staff manage topics" on public.topics;
create policy "Staff manage topics" on public.topics for all to authenticated
using (public.has_staff_role(array['teacher','admin']))
with check (public.has_staff_role(array['teacher','admin']));

drop policy if exists "Vocabulary is readable" on public.vocabulary;
create policy "Vocabulary is readable" on public.vocabulary for select to anon, authenticated using (true);
drop policy if exists "Staff manage vocabulary" on public.vocabulary;
create policy "Staff manage vocabulary" on public.vocabulary for all to authenticated
using (public.has_staff_role(array['teacher','admin']))
with check (public.has_staff_role(array['teacher','admin']));

drop policy if exists "Dialogue templates are readable" on public.dialogue_templates;
create policy "Dialogue templates are readable" on public.dialogue_templates for select to anon, authenticated using (true);
drop policy if exists "Staff manage dialogue templates" on public.dialogue_templates;
create policy "Staff manage dialogue templates" on public.dialogue_templates for all to authenticated
using (public.has_staff_role(array['teacher','admin']))
with check (public.has_staff_role(array['teacher','admin']));

drop policy if exists "Users read own progress" on public.learning_progress;
create policy "Users read own progress" on public.learning_progress for select to authenticated using (user_id = auth.uid());
drop policy if exists "Users add own progress" on public.learning_progress;
create policy "Users add own progress" on public.learning_progress for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "Users delete own progress" on public.learning_progress;
create policy "Users delete own progress" on public.learning_progress for delete to authenticated using (user_id = auth.uid());

-- Seed topics (safe to run more than once).
insert into public.topics (slug, title, title_ar, description, level, icon, sort_order) values
('taaruf', 'Perkenalan', 'التَّعَارُف', 'Menyapa, memperkenalkan diri, dan bertanya tentang identitas.', 'A1', 'handshake', 1),
('school', 'Sekolah', 'الْمَدْرَسَة', 'Bertanya tentang kelas, buku, alat tulis, dan pelajaran.', 'A1', 'school', 2),
('family', 'Keluarga', 'الْأُسْرَة', 'Mengenal anggota keluarga dan menjelaskan hubungan.', 'A1', 'users', 3),
('food', 'Makanan & Minuman', 'الطَّعَامُ وَالشَّرَابُ', 'Memesan makanan dan minuman dengan ungkapan sopan.', 'A1', 'utensils', 4),
('market', 'Di Pasar', 'فِي السُّوق', 'Bertanya harga dan menyebut barang yang ingin dibeli.', 'A1', 'shopping-bag', 5)
on conflict (slug) do update set title = excluded.title, title_ar = excluded.title_ar, description = excluded.description, level = excluded.level, icon = excluded.icon, sort_order = excluded.sort_order;

insert into public.vocabulary (topic_id, arabic, transliteration, meaning_id, word_type, gender, form_accusative, grammar_tags, level)
select t.id, v.arabic, v.transliteration, v.meaning_id, v.word_type, v.gender, v.form_accusative, v.grammar_tags, v.level
from (values
  ('taaruf','السَّلَامُ عَلَيْكُمْ','as-salāmu ‘alaikum','Semoga keselamatan tercurah kepada kalian','ungkapan',null,null,array['greeting','phrase']::text[],'A1'),
  ('taaruf','وَعَلَيْكُمُ السَّلَامُ','wa ‘alaikumus-salām','Dan semoga keselamatan juga tercurah kepada kalian','ungkapan',null,null,array['greeting','phrase']::text[],'A1'),
  ('taaruf','مَا اسْمُكَ؟','mā ismuka?','Siapa namamu? (laki-laki)','kalimat',null,null,array['question','identity']::text[],'A1'),
  ('taaruf','اسْمِي ...','ismī ...','Nama saya ...','ungkapan',null,null,array['identity','phrase']::text[],'A1'),
  ('taaruf','طَالِبٌ','ṭālibun','Siswa / pelajar laki-laki','isim','maskulin','طَالِبًا',array['identity','person']::text[],'A1'),
  ('taaruf','مِنْ إِنْدُونِيسِيَا','min Indūnīsiyā','Dari Indonesia','frasa',null,null,array['identity','place']::text[],'A1'),
  ('school','مَدْرَسَةٌ','madrasatun','Sekolah','isim','feminin','مَدْرَسَةً',array['school','place']::text[],'A1'),
  ('school','كِتَابٌ','kitābun','Buku','isim','maskulin','كِتَابًا',array['school','object']::text[],'A1'),
  ('school','قَلَمٌ','qalamun','Pulpen','isim','maskulin','قَلَمًا',array['school','object']::text[],'A1'),
  ('school','مُعَلِّمٌ','mu‘allimun','Guru laki-laki','isim','maskulin','مُعَلِّمًا',array['school','person']::text[],'A1'),
  ('school','اللُّغَةُ الْعَرَبِيَّةُ','al-lughah al-‘arabiyyah','Bahasa Arab','frasa','feminin',null,array['school','subject']::text[],'A1'),
  ('school','فَصْلٌ','faṣlun','Kelas','isim','maskulin','فَصْلًا',array['school','place']::text[],'A1'),
  ('family','أَبِي','abī','Ayah saya','isim','maskulin',null,array['family','person']::text[],'A1'),
  ('family','أُمِّي','ummī','Ibu saya','isim','feminin',null,array['family','person']::text[],'A1'),
  ('family','أَخِي','akhī','Saudara laki-laki saya','isim','maskulin',null,array['family','person']::text[],'A1'),
  ('family','أُخْتِي','ukhtī','Saudara perempuan saya','isim','feminin',null,array['family','person']::text[],'A1'),
  ('family','أُسْرَةٌ','usratun','Keluarga','isim','feminin','أُسْرَةً',array['family']::text[],'A1'),
  ('food','مَاءٌ','mā’un','Air','isim','maskulin','مَاءً',array['food-item','drink']::text[],'A1'),
  ('food','عَصِيرٌ','‘aṣīrun','Jus','isim','maskulin','عَصِيرًا',array['food-item','drink']::text[],'A1'),
  ('food','خُبْزٌ','khubzun','Roti','isim','maskulin','خُبْزًا',array['food-item','food']::text[],'A1'),
  ('food','أُرِيدُ','urīdu','Saya ingin','fi''il',null,null,array['request','phrase']::text[],'A1'),
  ('food','مِنْ فَضْلِكَ','min faḍlika','Tolong / silakan (kepada laki-laki)','ungkapan',null,null,array['polite','phrase']::text[],'A1'),
  ('food','شُكْرًا','shukran','Terima kasih','ungkapan',null,null,array['polite','phrase']::text[],'A1'),
  ('market','بِكَمْ هَذَا؟','bikam hādhā?','Berapa harga ini?','kalimat',null,null,array['shopping','question']::text[],'A1'),
  ('market','رَخِيصٌ','rakhīṣun','Murah','sifat','maskulin',null,array['shopping','adjective']::text[],'A1'),
  ('market','غَالٍ','ghālin','Mahal','sifat','maskulin',null,array['shopping','adjective']::text[],'A1'),
  ('market','أُرِيدُ هَذَا','urīdu hādhā','Saya ingin ini','ungkapan',null,null,array['shopping','request']::text[],'A1'),
  ('market','كَمْ؟','kam?','Berapa?','kata tanya',null,null,array['question']::text[],'A1'),
  ('market','نَعَمْ','na‘am','Ya','jawaban',null,null,array['response']::text[],'A1')
) as v(topic_slug, arabic, transliteration, meaning_id, word_type, gender, form_accusative, grammar_tags, level)
join public.topics t on t.slug = v.topic_slug
on conflict (topic_id, arabic, meaning_id) do nothing;
