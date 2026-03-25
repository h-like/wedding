export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  fontSize: 'sm' | 'md' | 'lg';
}

export interface SectionVisibility {
  map: boolean;
  gallery: boolean;
  rsvp: boolean;
  account: boolean;
}

export interface AccountInfo {
  bank: string;
  name: string;
  number: string;
}

export interface ContentOverrides {
  greetingTitle?: string;
  greetingBody?: string;
  mapDirections?: string;
  rsvpMessage?: string;
}

export interface Invitation {
  id: string;
  user_id?: string | null;
  slug: string | null;
  is_published: boolean;

  // 기본 정보
  groom_name: string;
  bride_name: string;
  wedding_date: string | null;
  wedding_time: string | null;
  venue_name: string;
  venue_address: string | null;
  venue_map_url: string | null;
  venue_lat: number | null;
  venue_lng: number | null;
  message: string | null;

  // 계좌번호
  groom_account: AccountInfo | null;
  bride_account: AccountInfo | null;

  // 갤러리
  gallery_images: string[];

  // 에디터 상태
  template_id: string;
  theme: ThemeConfig;
  content_overrides: ContentOverrides;
  section_visibility: SectionVisibility;

  created_at: string;
  updated_at: string;
}

export type InvitationInput = Omit<Invitation, 'id' | 'slug' | 'is_published' | 'created_at' | 'updated_at'>;

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  map: true,
  gallery: true,
  rsvp: true,
  account: true,
};

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#2d2d2d',
  secondaryColor: '#888888',
  backgroundColor: '#ffffff',
  textColor: '#2d2d2d',
  headingFont: 'Noto Serif KR',
  bodyFont: 'Noto Sans KR',
  fontSize: 'md',
};
