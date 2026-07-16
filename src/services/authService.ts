import { User, UserRole, SubscriptionPlan, SetupStage, AuthSession } from '../types';

// Mock database in localStorage
const STORAGE_USERS_KEY = 'acot_mock_users';
const STORAGE_SESSION_KEY = 'acot_session';
const STORAGE_REMEMBER_KEY = 'acot_remember_me';

// Seed demo users
const DEMO_USERS: User[] = [
  {
    id: 'demo-investor',
    name: 'Sarah Jenkins',
    email: 'investor@acot.demo',
    role: 'investor',
    subscription: 'pro',
    company: 'Alpha Capital Dubai',
    country: 'United Arab Emirates',
    phoneNumber: '+971 50 123 4567',
    preferredCurrency: 'AED',
    preferredUnit: 'sq_ft',
    setupStage: 'completed',
  },
  {
    id: 'demo-agent',
    name: 'Ahmed Mohammed',
    email: 'agent@acot.demo',
    role: 'agent',
    subscription: 'agent',
    company: 'ABC Realty',
    country: 'United Arab Emirates',
    phoneNumber: '+971 52 987 6543',
    preferredCurrency: 'AED',
    preferredUnit: 'sq_m',
    setupStage: 'completed',
  },
  {
    id: 'demo-admin',
    name: 'ACOT Admin',
    email: 'admin@acot.demo',
    role: 'admin',
    subscription: 'enterprise',
    company: 'ACOT Technologies Ltd',
    country: 'United Arab Emirates',
    phoneNumber: '+971 4 555 0199',
    preferredCurrency: 'USD',
    preferredUnit: 'sq_ft',
    setupStage: 'completed',
  },
];

// Helper to initialize users in storage
const getStoredUsers = (): User[] => {
  const usersJson = localStorage.getItem(STORAGE_USERS_KEY);
  if (!usersJson) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEMO_USERS));
    return DEMO_USERS;
  }
  return JSON.parse(usersJson);
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
};

// Simulate network latency helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class AuthService {
  // Simulate potential network errors (can be checked in UI or mock-triggered)
  static async simulateNetworkCall() {
    await delay(1000); // 1s realistic latency
    // If the user's email ends with 'error@acot.demo', force a network error
    return false;
  }

  static async login(email: string, password: string, rememberMe: boolean = false): Promise<AuthSession> {
    await this.simulateNetworkCall();

    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    if (email.toLowerCase().endsWith('error@acot.demo')) {
      throw new Error('Mock Network Error: Database connection timeout. Please try again.');
    }

    // Check credentials
    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    // In our mock system, accounts use 'demo123' or 'Acot@123' as password
    const isPasswordValid = password === 'demo123' || password === 'Acot@123';
    if (!user || !isPasswordValid) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    // Generate tokens
    const accessToken = 'mock_access_token_' + Math.random().toString(36).substring(2);
    const refreshToken = 'mock_refresh_token_' + Math.random().toString(36).substring(2);
    const expiresAt = Date.now() + 3600 * 1000; // 1 hour

    const session: AuthSession = {
      user,
      accessToken,
      refreshToken,
      expiresAt,
    };

    // Store session
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(STORAGE_REMEMBER_KEY, rememberMe ? 'true' : 'false');

    return session;
  }

  static async signup(name: string, email: string, password: string): Promise<User> {
    await this.simulateNetworkCall();

    if (!name || !email || !password) {
      throw new Error('All fields are required.');
    }

    if (email.toLowerCase().endsWith('error@acot.demo')) {
      throw new Error('Mock Network Error: Failed to initiate signup session.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const users = getStoredUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      setupStage: 'email-verification',
    };

    users.push(newUser);
    saveUsers(users);

    return newUser;
  }

  static async verifyOtp(email: string, otp: string): Promise<User> {
    await this.simulateNetworkCall();

    if (!otp || otp.length !== 6) {
      throw new Error('Please enter a valid 6-digit verification code.');
    }

    if (email.toLowerCase().endsWith('error@acot.demo')) {
      throw new Error('Mock Network Error: OTP service unavailable.');
    }

    // Demo rule: Any OTP works, but "000000" or empty triggers invalid OTP for demoing error state
    if (otp === '000000') {
      throw new Error('Invalid verification code. Please check and try again.');
    }

    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
      throw new Error('User not found.');
    }

    const user = users[userIndex];
    user.setupStage = 'role-selection';
    users[userIndex] = user;
    saveUsers(users);

    // Update active session if there is one
    const activeSession = this.getStoredSession();
    if (activeSession && activeSession.user.email.toLowerCase() === email.toLowerCase()) {
      activeSession.user = user;
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(activeSession));
    }

    return user;
  }

  static async updateRole(email: string, role: UserRole): Promise<User> {
    await this.simulateNetworkCall();

    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
      throw new Error('User not found.');
    }

    const user = users[userIndex];
    user.role = role;
    user.setupStage = 'subscription-selection';
    users[userIndex] = user;
    saveUsers(users);

    const activeSession = this.getStoredSession();
    if (activeSession && activeSession.user.email.toLowerCase() === email.toLowerCase()) {
      activeSession.user = user;
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(activeSession));
    }

    return user;
  }

  static async updateSubscription(email: string, subscription: SubscriptionPlan): Promise<User> {
    await this.simulateNetworkCall();

    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
      throw new Error('User not found.');
    }

    const user = users[userIndex];
    user.subscription = subscription;
    user.setupStage = 'profile-setup';
    users[userIndex] = user;
    saveUsers(users);

    const activeSession = this.getStoredSession();
    if (activeSession && activeSession.user.email.toLowerCase() === email.toLowerCase()) {
      activeSession.user = user;
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(activeSession));
    }

    return user;
  }

  static async updateProfile(
    email: string,
    profileData: {
      company: string;
      country: string;
      phoneNumber: string;
      preferredCurrency: string;
      preferredUnit: string;
    }
  ): Promise<User> {
    await this.simulateNetworkCall();

    if (!profileData.phoneNumber || !profileData.country) {
      throw new Error('Phone number and country are required.');
    }

    const users = getStoredUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
      throw new Error('User not found.');
    }

    const user = users[userIndex];
    user.company = profileData.company;
    user.country = profileData.country;
    user.phoneNumber = profileData.phoneNumber;
    user.preferredCurrency = profileData.preferredCurrency;
    user.preferredUnit = profileData.preferredUnit;
    user.setupStage = 'completed';
    users[userIndex] = user;
    saveUsers(users);

    const activeSession = this.getStoredSession();
    if (activeSession && activeSession.user.email.toLowerCase() === email.toLowerCase()) {
      activeSession.user = user;
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(activeSession));
    }

    return user;
  }

  static async forgotPassword(email: string): Promise<boolean> {
    await this.simulateNetworkCall();

    if (!email) {
      throw new Error('Please enter your email address.');
    }

    if (email.toLowerCase().endsWith('error@acot.demo')) {
      throw new Error('Mock Network Error: Forgot password service failed.');
    }

    // For demo purposes, we will approve any email but let them know we sent a mock reset link
    return true;
  }

  static async resetPassword(email: string, newPassword: string): Promise<boolean> {
    await this.simulateNetworkCall();

    if (!newPassword || newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // In this mock system we update the fake user DB
    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    // (In a real system, the token matches the user, here we assume reset for specified email)
    if (!user) {
      throw new Error('User session not found.');
    }

    // Password reset success
    return true;
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  }

  static getStoredSession(): AuthSession | null {
    const sessionJson = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!sessionJson) return null;
    try {
      return JSON.parse(sessionJson) as AuthSession;
    } catch {
      return null;
    }
  }

  static isRememberMe(): boolean {
    return localStorage.getItem(STORAGE_REMEMBER_KEY) === 'true';
  }
}
