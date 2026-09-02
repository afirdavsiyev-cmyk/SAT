export type AuthProviderType = 'email' | 'google' | 'telegram';

export interface ActiveUserProfile {
  firstName: string;
  email: string;
  avatar?: string;
  streakDays: number;
  targetScore: string | number;     // e.g. "780+" or 800
  baselineScore: number;            // e.g. 620, 680, 750
  currentEstimatedMath: number;     // live calibrated score
  mainReason: string;
  biggestMotivation: string;
  targetExamDate?: string;
  onboardingCompleted?: boolean;
}

export interface UserOnboardingProfile {
  firstName: string;
  email: string;
  ageRange: string;
  country: string;
  takenBefore: 'Yes' | 'No';
  latestScore?: string;
  targetScore: string;
  mainReason: string;
  meaning: string;
  studentType: string;
  biggestMotivation: string;
  hearAbout: string;
  completedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: AuthProviderType;
  username?: string;
  photoUrl?: string;
  createdAt?: string;
  onboardingCompleted?: boolean;
  onboardingProfile?: UserOnboardingProfile;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}
