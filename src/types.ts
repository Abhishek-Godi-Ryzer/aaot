export type PagePath =
  | '/'
  | '/solutions'
  | '/ai-intelligence'
  | '/pricing'
  | '/about'
  | '/contact'
  | '/login'
  | '/signup'
  | '/verify-email'
  | '/forgot-password'
  | '/reset-password'
  | '/select-role'
  | '/select-subscription'
  | '/setup-profile'
  | '/investor'
  | '/agent'
  | '/admin';

export interface NavItem {
  label: string;
  path: PagePath;
}

export type UserRole = 'investor' | 'agent' | 'admin';
export type SubscriptionPlan = 'free' | 'pro' | 'agent' | 'enterprise';
export type SetupStage = 'completed' | 'email-verification' | 'role-selection' | 'subscription-selection' | 'profile-setup';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  subscription?: SubscriptionPlan;
  company?: string;
  country?: string;
  phoneNumber?: string;
  preferredCurrency?: string;
  preferredUnit?: string;
  setupStage: SetupStage;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp
}
