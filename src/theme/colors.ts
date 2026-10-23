export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  scoreLow: string;
  scoreMid: string;
  scoreHigh: string;
  modalOverlay: string;
  offlineBannerBg: string;
  offlineBannerText: string;
}

export const lightColors: ColorPalette = {
  primary: '#E07A5F',       // Warm terracotta
  primaryLight: '#FCEBE6',  // Soft peach
  primaryDark: '#B85338',   // Deep brick
  secondary: '#3D405B',     // Rich slate navy
  accent: '#81B29A',        // Sage green
  background: '#F8F9FA',    // Clean soft paper
  card: '#FFFFFF',          // Pure card white
  cardBorder: '#E9ECEF',    // Subtle divider
  text: '#1F2937',          // Deep charcoal
  textSecondary: '#4B5563', // Slate gray
  textMuted: '#9CA3AF',     // Muted gray
  border: '#E5E7EB',
  badgeBg: '#F3F4F6',
  badgeText: '#374151',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  scoreLow: '#9CA3AF',      // Level 1-2
  scoreMid: '#F59E0B',      // Level 3
  scoreHigh: '#E07A5F',     // Level 4-5
  modalOverlay: 'rgba(15, 23, 42, 0.65)',
  offlineBannerBg: '#FEF3C7',
  offlineBannerText: '#92400E',
};

export const darkColors: ColorPalette = {
  primary: '#F28B6E',
  primaryLight: '#3D251E',
  primaryDark: '#D4684D',
  secondary: '#8E94B8',
  accent: '#9BCBB5',
  background: '#0F172A',    // Deep obsidian/slate
  card: '#1E293B',          // Elevated dark card
  cardBorder: '#334155',    // Card stroke
  text: '#F8FAFC',          // Crisp white
  textSecondary: '#CBD5E1', // Soft light gray
  textMuted: '#64748B',     // Dim slate
  border: '#334155',
  badgeBg: '#334155',
  badgeText: '#E2E8F0',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  info: '#60A5FA',
  scoreLow: '#475569',
  scoreMid: '#FBBF24',
  scoreHigh: '#F28B6E',
  modalOverlay: 'rgba(0, 0, 0, 0.75)',
  offlineBannerBg: '#78350F',
  offlineBannerText: '#FEF3C7',
};
