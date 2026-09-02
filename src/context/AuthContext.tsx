import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, TelegramUser, UserOnboardingProfile, ActiveUserProfile } from '../types/auth';

const STORAGE_KEY = 'scoreup_auth_user';
const PROFILE_KEY = 'scoreup_user_profile';
const REGISTERED_USERS_KEY = 'scoreup_registered_users';
const ACTIVE_USER_KEY = 'scoreup_active_user';

export const buildActiveUserProfile = (
  authUser?: Partial<AuthUser> | null,
  onboarding?: Partial<UserOnboardingProfile> | null,
  existingActive?: Partial<ActiveUserProfile> | null
): ActiveUserProfile => {
  // Parse target score
  const targetScore: string | number =
    onboarding?.targetScore || existingActive?.targetScore || '780+';

  // Parse baseline score
  let baseline = 650;
  if (onboarding?.latestScore) {
    const match = onboarding.latestScore.match(/(\d+)/);
    if (match) baseline = parseInt(match[1], 10);
  } else if (existingActive?.baselineScore) {
    baseline = existingActive.baselineScore;
  }

  // Parse first name cleanly - prevent single-letter names
  let firstName = onboarding?.firstName?.trim() || existingActive?.firstName?.trim() || '';
  if (!firstName && authUser?.name) {
    firstName = authUser.name.split(' ')[0].trim();
  }
  if (!firstName || firstName.length <= 1) {
    firstName = 'Student';
  }

  const email = onboarding?.email || authUser?.email || existingActive?.email || 'student@scoreup.app';
  const avatar = authUser?.photoUrl || existingActive?.avatar;
  const streakDays = existingActive?.streakDays || 4;
  const currentEstimatedMath = existingActive?.currentEstimatedMath || baseline || 680;
  const mainReason = onboarding?.mainReason || existingActive?.mainReason || 'Get into my dream university';
  const biggestMotivation = onboarding?.biggestMotivation || existingActive?.biggestMotivation || 'My future';
  const targetExamDate = existingActive?.targetExamDate || 'May 3, 2026';
  const onboardingCompleted = onboarding
    ? true
    : (existingActive?.onboardingCompleted ?? authUser?.onboardingCompleted ?? false);

  return {
    firstName,
    email,
    avatar,
    streakDays,
    targetScore,
    baselineScore: baseline,
    currentEstimatedMath,
    mainReason,
    biggestMotivation,
    targetExamDate,
    onboardingCompleted,
  };
};

interface AuthContextType {
  user: AuthUser | null;
  activeUser: ActiveUserProfile;
  updateActiveUser: (partial: Partial<ActiveUserProfile>) => void;
  isAuthenticated: boolean;
  onboardingProfile: UserOnboardingProfile | null;
  saveOnboardingProfile: (profile: UserOnboardingProfile) => void;
  isOnboardingModalOpen: boolean;
  setIsOnboardingModalOpen: (open: boolean) => void;
  openOnboardingModal: () => void;
  closeOnboardingModal: () => void;
  loginWithEmail: (email: string, password?: string) => Promise<AuthUser>;
  signupWithEmail: (name: string, email: string, password?: string) => Promise<AuthUser>;
  loginWithGoogle: () => Promise<AuthUser>;
  loginWithTelegram: () => void;
  handleTelegramAuth: (tgUser: TelegramUser) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved auth user', e);
    }
    return null;
  });

  const [onboardingProfile, setOnboardingProfile] = useState<UserOnboardingProfile | null>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved user onboarding profile', e);
    }
    return null;
  });

  const [activeUser, setActiveUser] = useState<ActiveUserProfile>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse active user profile', e);
    }
    const authInit = (() => {
      try {
        const s = localStorage.getItem(STORAGE_KEY);
        return s ? JSON.parse(s) : null;
      } catch {
        return null;
      }
    })();
    const profileInit = (() => {
      try {
        const s = localStorage.getItem(PROFILE_KEY);
        return s ? JSON.parse(s) : null;
      } catch {
        return null;
      }
    })();
    return buildActiveUserProfile(authInit, profileInit, null);
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openOnboardingModal = () => {
    setIsOnboardingModalOpen(true);
  };

  const closeOnboardingModal = () => {
    setIsOnboardingModalOpen(false);
  };

  const saveUserSession = (newUser: AuthUser | null) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        localStorage.setItem('scoreup_logged_in_user', newUser.email);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('scoreup_logged_in_user');
      }
      window.dispatchEvent(new CustomEvent('scoreup_auth_changed', { detail: newUser }));
    } catch (e) {
      console.error('Failed to write auth session', e);
    }
  };

  const getRegisteredUsers = (): Record<string, AuthUser> => {
    try {
      const data = localStorage.getItem(REGISTERED_USERS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const saveRegisteredUser = (userData: AuthUser) => {
    try {
      const users = getRegisteredUsers();
      const emailKey = userData.email.toLowerCase();
      users[emailKey] = userData;
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to update registered users database', e);
    }
  };

  const updateActiveUser = (partial: Partial<ActiveUserProfile>) => {
    setActiveUser((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('scoreup_user_updated'));
      } catch {}
      return updated;
    });
  };

  // Route authentications: existing completed user -> instant dashboard, new user -> onboarding wizard
  const handleAuthSuccess = (authenticatedUser: AuthUser, isSignup: boolean = false) => {
    const emailKey = authenticatedUser.email.toLowerCase();
    const existingUsers = getRegisteredUsers();
    const existingProfile = existingUsers[emailKey];

    if (!isSignup && existingProfile && existingProfile.onboardingCompleted) {
      // Existing user: direct login without wizard
      saveUserSession(existingProfile);
      if (existingProfile.onboardingProfile) {
        setOnboardingProfile(existingProfile.onboardingProfile);
      }
      const synched = buildActiveUserProfile(existingProfile, existingProfile.onboardingProfile, activeUser);
      synched.onboardingCompleted = true;
      setActiveUser(synched);
      try {
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(synched));
        window.dispatchEvent(new Event('scoreup_user_updated'));
      } catch {}

      setIsAuthModalOpen(false);
      setIsOnboardingModalOpen(false);
      window.dispatchEvent(new CustomEvent('scoreup_login_success', { detail: { view: 'dashboard' } }));
    } else {
      // First-time user or signup: store initial user with onboardingCompleted: false
      const newProfile: AuthUser = {
        ...authenticatedUser,
        name: authenticatedUser.name || 'Student',
        onboardingCompleted: false,
        onboardingProfile: existingProfile?.onboardingProfile || undefined,
      };
      saveUserSession(newProfile);
      saveRegisteredUser(newProfile);

      const synched = buildActiveUserProfile(newProfile, newProfile.onboardingProfile, activeUser);
      synched.onboardingCompleted = false;
      setActiveUser(synched);
      try {
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(synched));
        window.dispatchEvent(new Event('scoreup_user_updated'));
      } catch {}

      setIsAuthModalOpen(false);
      setTimeout(() => {
        setIsOnboardingModalOpen(true);
      }, 350);
    }
  };

  const saveOnboardingProfile = (profile: UserOnboardingProfile) => {
    setOnboardingProfile(profile);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

      const updatedUser: AuthUser = {
        id: user?.id || `usr_${Date.now().toString(36)}`,
        name: profile.firstName || user?.name || 'Student',
        email: profile.email || user?.email || '',
        provider: user?.provider || 'email',
        username: user?.username,
        photoUrl: user?.photoUrl,
        createdAt: user?.createdAt || new Date().toISOString(),
        onboardingCompleted: true,
        onboardingProfile: profile,
      };

      saveRegisteredUser(updatedUser);
      saveUserSession(updatedUser);

      // Unify into activeUser
      const updatedActive = buildActiveUserProfile(updatedUser, profile, activeUser);
      updatedActive.onboardingCompleted = true;
      setActiveUser(updatedActive);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(updatedActive));
      window.dispatchEvent(new Event('scoreup_user_updated'));

      setIsOnboardingModalOpen(false);
      window.dispatchEvent(new CustomEvent('scoreup_profile_updated', { detail: profile }));
      window.dispatchEvent(new CustomEvent('scoreup_login_success', { detail: { view: 'dashboard' } }));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  };

  // Sync across tabs / storage changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
      }
      if (e.key === PROFILE_KEY) {
        try {
          setOnboardingProfile(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {}
      }
      if (e.key === ACTIVE_USER_KEY) {
        try {
          if (e.newValue) setActiveUser(JSON.parse(e.newValue));
        } catch {}
      }
    };

    const handleUserUpdated = () => {
      try {
        const saved = localStorage.getItem(ACTIVE_USER_KEY);
        if (saved) setActiveUser(JSON.parse(saved));
      } catch {}
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('scoreup_user_updated', handleUserUpdated);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('scoreup_user_updated', handleUserUpdated);
    };
  }, []);

  const loginWithEmail = async (email: string): Promise<AuthUser> => {
    await new Promise((r) => setTimeout(r, 450));
    const namePart = email.split('@')[0] || 'Student';
    const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const authedUser: AuthUser = {
      id: `usr_${Date.now().toString(36)}`,
      name: capitalized,
      email,
      provider: 'email',
      createdAt: new Date().toISOString(),
    };
    handleAuthSuccess(authedUser, false);
    return authedUser;
  };

  const signupWithEmail = async (name: string, email: string): Promise<AuthUser> => {
    await new Promise((r) => setTimeout(r, 450));
    const authedUser: AuthUser = {
      id: `usr_${Date.now().toString(36)}`,
      name: name.trim() || 'Student',
      email,
      provider: 'email',
      createdAt: new Date().toISOString(),
    };
    handleAuthSuccess(authedUser, true);
    return authedUser;
  };

  const loginWithGoogle = async (): Promise<AuthUser> => {
    await new Promise((r) => setTimeout(r, 550));
    const googleUser: AuthUser = {
      id: `usr_g_${Date.now().toString(36)}`,
      name: 'Alex Rivera',
      email: 'alex.rivera@gmail.com',
      provider: 'google',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      createdAt: new Date().toISOString(),
    };
    handleAuthSuccess(googleUser, false);
    return googleUser;
  };

  const handleTelegramAuth = (tgUser: TelegramUser) => {
    const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') || 'Telegram Scholar';
    const authedUser: AuthUser = {
      id: `usr_tg_${tgUser.id}`,
      name: fullName,
      username: tgUser.username ? `@${tgUser.username}` : undefined,
      email: tgUser.username ? `${tgUser.username}@telegram.user` : `tg_${tgUser.id}@scoreup.app`,
      provider: 'telegram',
      photoUrl: tgUser.photo_url,
      createdAt: new Date(tgUser.auth_date * 1000).toISOString(),
    };
    handleAuthSuccess(authedUser, false);
  };

  const loginWithTelegram = () => {
    const botName = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'ScoreUpSATBot';

    const popup = window.open(
      `https://oauth.telegram.org/auth?bot_id=${botName}&origin=${encodeURIComponent(window.location.origin)}`,
      'telegram_oauth',
      'width=550,height=470'
    );

    if (!popup || popup.closed) {
      setTimeout(() => {
        handleTelegramAuth({
          id: 884920194,
          first_name: 'SAT',
          last_name: 'Scholar',
          username: 'sat_scoreup_user',
          auth_date: Math.floor(Date.now() / 1000),
          hash: 'mock_hash_verification',
        });
      }, 500);
    } else {
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          if (!user) {
            handleTelegramAuth({
              id: 884920194,
              first_name: 'SAT',
              last_name: 'Scholar',
              username: 'sat_scoreup_user',
              auth_date: Math.floor(Date.now() / 1000),
              hash: 'mock_hash_verification',
            });
          }
        }
      }, 800);
    }
  };

  const logout = () => {
    saveUserSession(null);
    const guestUser = buildActiveUserProfile(null, null, null);
    setActiveUser(guestUser);
    try {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(guestUser));
      window.dispatchEvent(new Event('scoreup_user_updated'));
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeUser,
        updateActiveUser,
        isAuthenticated: !!user,
        onboardingProfile,
        saveOnboardingProfile,
        isOnboardingModalOpen,
        setIsOnboardingModalOpen,
        openOnboardingModal,
        closeOnboardingModal,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        loginWithTelegram,
        handleTelegramAuth,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
