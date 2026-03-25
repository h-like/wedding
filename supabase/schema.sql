-- 청첩장 테이블
create table if not exists invitations (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete set null,
  slug                text unique,
  is_published        boolean default false,

  -- 기본 정보
  groom_name          text not null,
  bride_name          text not null,
  wedding_date        date,
  wedding_time        text,
  venue_name          text not null,
  venue_address       text,
  venue_map_url       text,
  venue_lat           double precision,
  venue_lng           double precision,
  message             text,

  -- 계좌번호
  groom_account       jsonb,
  bride_account       jsonb,

  -- 갤러리
  gallery_images      text[] default '{}',

  -- 에디터 상태
  template_id         text not null default 'minimal-white',
  theme               jsonb not null default '{}',
  content_overrides   jsonb not null default '{}',
  section_visibility  jsonb not null default '{"map":true,"gallery":true,"rsvp":true,"account":true}',

  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- venue_lat/lng 컬럼 추가 (기존 DB에 적용할 마이그레이션)
-- alter table invitations add column if not exists venue_lat double precision;
-- alter table invitations add column if not exists venue_lng double precision;

-- RSVP 응답 테이블
create table if not exists rsvp_responses (
  id              uuid primary key default gen_random_uuid(),
  invitation_id   uuid references invitations(id) on delete cascade,
  guest_name      text not null,
  attending       boolean not null,
  guest_count     int default 1,
  message         text,
  created_at      timestamptz default now()
);

-- RLS (Row Level Security) 활성화
alter table invitations enable row level security;
alter table rsvp_responses enable row level security;

-- 공개된 청첩장은 누구나 읽기 가능
create policy "Public invitations are viewable by everyone"
  on invitations for select
  using (is_published = true);

-- 서비스 롤로만 생성/수정 (API Routes에서 service role key 사용)
create policy "Service role can manage invitations"
  on invitations for all
  using (true)
  with check (true);

-- RSVP는 누구나 생성 가능 (공개 초대장)
create policy "Anyone can submit RSVP"
  on rsvp_responses for insert
  with check (true);

-- RSVP 조회는 서비스 롤만
create policy "Service role can view RSVP"
  on rsvp_responses for select
  using (true);

-- Storage 버킷 생성 (갤러리 이미지)
-- Supabase 대시보드 > Storage에서 'wedding-gallery' 버킷을 public으로 생성하세요
