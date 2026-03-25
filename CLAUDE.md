# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npx tsc --noEmit # 타입 체크만
```

## Architecture

**Stack**: Next.js 16 (App Router, Turbopack), Supabase (Postgres + Auth), Tailwind CSS

### Key Routes
- `/` — 랜딩 페이지
- `/create` — 청첩장 정보 입력 폼 → API 호출 후 `/editor/[id]`로 이동
- `/editor/[id]` — 에디터 (Client Component, `useReducer` 상태 관리, 자동저장)
- `/i/[slug]` — 공개 청첩장 뷰어 (Server Component, OG 메타태그 포함)

### Template System

핵심 패턴: **CSS Custom Properties + React 컴포넌트**

`TemplateRenderer` (`components/templates/TemplateRenderer.tsx`)가 `invitation.theme` 값을 CSS 변수(`--color-primary`, `--font-heading` 등)로 주입하고, 각 템플릿 컴포넌트를 렌더링한다.

템플릿 목록: `lib/templates.ts`의 `TEMPLATES` 배열에 등록. 새 템플릿 추가 시 `components/templates/` 에 파일 생성 후 `TemplateRenderer.tsx`의 `componentMap`에 추가.

모든 템플릿 컴포넌트는 `TemplateProps` 인터페이스를 따름:
```typescript
interface TemplateProps {
  invitation: Invitation
  editorMode?: boolean         // true면 contentEditable 텍스트 편집 활성화
  onTextChange?: (field, value) => void
}
```

### Editor State

`app/editor/[id]/page.tsx`에서 `useReducer`로 전체 `Invitation` 객체를 관리. 변경 시 1초 debounce → `PATCH /api/invitations/[id]` 자동저장.

`EditorAction` 타입:
- `SET_TEMPLATE` — 템플릿 교체 (기본 테마로 리셋)
- `SET_THEME` — `ThemeConfig` 부분 업데이트
- `SET_SECTION` — 섹션 표시 토글
- `SET_CONTENT` — `ContentOverrides` 부분 업데이트

### Data Model

핵심 타입은 `types/invitation.ts`:
- `Invitation` — DB 행 전체
- `ThemeConfig` — 색상, 폰트, 크기
- `SectionVisibility` — map/gallery/rsvp/account 온오프
- `ContentOverrides` — 인사말 제목/본문 등 텍스트 오버라이드

### Supabase

- `lib/supabase.ts`: 브라우저 클라이언트 (`createClient`), 서버 클라이언트 (`createServerSupabaseClient`), 서비스 롤 클라이언트 (`createServiceClient`)
- API Routes는 `createServiceClient` (service role key) 사용
- Server Components는 `createServerSupabaseClient` 사용
- DB 스키마: `supabase/schema.sql`

### Environment Variables

`.env.local.example` 참고:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_BASE_URL

# 카카오 지도 API (https://developers.kakao.com)
KAKAO_REST_API_KEY              # 서버 전용 — 장소 검색 (/api/venue-search)
NEXT_PUBLIC_KAKAO_MAP_APP_KEY   # 클라이언트 — Static Map 이미지 표시
```

## Supabase 초기 세팅 (최초 1회)

1. Supabase 프로젝트 생성 후 `supabase/schema.sql` 실행
2. Storage에서 `wedding-gallery` 버킷을 public으로 생성
3. Auth > Providers에서 Google, Kakao 활성화
4. `.env.local`에 실제 키 입력
