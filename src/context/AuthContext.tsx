import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, SubscriptionPlan, SetupStage, AuthSession } from '../types';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  resetEmail: string | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<User>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<User>;
  verifyOtp: (otp: string) => Promise<User>;
  selectRole: (role: UserRole) => Promise<User>;
  selectSubscription: (subscription: SubscriptionPlan) => Promise<User>;
  setupProfile: (profileData: {
    company: string;
    country: string;
    phoneNumber: string;
    preferredCurrency: string;
    preferredUnit: string;
  }) => Promise<User>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (password: string) => Promise<boolean>;
  setResetEmail: (email: string | null) => void;
  clearError: () => void;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);

  // Restore session on load
  useEffect(() => {
    const session = AuthService.getStoredSession();
    if (session) {
      const isRemember = AuthService.isRememberMe();
      const isExpired = Date.now() > session.expiresAt;

      if (!isExpired || isRemember) {
        setUser(session.user);
        setAccessToken(session.accessToken);
      } else {
        AuthService.logout();
      }
    }
    setIsLoading(false);
  }, []);

  const clearError = () => setError(null);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await AuthService.login(email, password, rememberMe);
      setUser(session.user);
      setAccessToken(session.accessToken);
      return session.user;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setAccessToken(null);
    setError(null);
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await AuthService.signup(name, email, password);
      // Initiate a temporary session for verification
      const tempSession: AuthSession = {
        user: newUser,
        accessToken: 'temp_token',
        refreshToken: 'temp_refresh_token',
        expiresAt: Date.now() + 3600 * 1000,
      };
      localStorage.setItem('acot_session', JSON.stringify(tempSession));
      setUser(newUser);
      return newUser;
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    if (!user) throw new Error('No user session active.');
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await AuthService.verifyOtp(user.email, otp);
      setUser({ ...updatedUser });
      return updatedUser;
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const selectRole = async (role: UserRole) => {
    if (!user) throw new Error('No user session active.');
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await AuthService.updateRole(user.email, role);
      setUser({ ...updatedUser });
      return updatedUser;
    } catch (err: any) {
      setError(err.message || 'Failed to select role');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const selectSubscription = async (subscription: SubscriptionPlan) => {
    if (!user) throw new Error('No user session active.');
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await AuthService.updateSubscription(user.email, subscription);
      setUser({ ...updatedUser });
      return updatedUser;
    } catch (err: any) {
      setError(err.message || 'Failed to select subscription');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const setupProfile = async (profileData: {
    company: string;
    country: string;
    phoneNumber: string;
    preferredCurrency: string;
    preferredUnit: string;
  }) => {
    if (!user) throw new Error('No user session active.');
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await AuthService.updateProfile(user.email, profileData);
      setUser({ ...updatedUser });
      return updatedUser;
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await AuthService.forgotPassword(email);
      setResetEmail(email);
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to process forgot password request');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (password: string) => {
    if (!resetEmail) throw new Error('No email set for password reset.');
    setIsLoading(true);
    setError(null);
    try {
      const success = await AuthService.resetPassword(resetEmail, password);
      setResetEmail(null);
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && user.setupStage === 'completed',
        isLoading,
        error,
        resetEmail,
        login,
        logout,
        signup,
        verifyOtp,
        selectRole,
        selectSubscription,
        setupProfile,
        forgotPassword,
        resetPassword,
        setResetEmail,
        clearError,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
