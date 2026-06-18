import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isAccountDisabled } from './AdminPlatformContext';
import type { UploadedDocument, UserRole } from '../types';

export type UserType = 'client' | 'librairie' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  location?: string;
  avatar?: string;
  language?: string;
  theme?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  type: UserType;
  location?: string;
  phone?: string;
  city?: string;
  country?: string;
  createdAt?: string;
}

export interface LibraryRequest {
  id: string;
  ownerName: string;
  libraryName: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  rccmNumber: string;
  taxpayerNumber: string;
  legalStatus: string;
  documents: UploadedDocument[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  registeredUsers: RegisteredUser[];
  libraryRequests: LibraryRequest[];
  login: (email: string, password: string, userType: UserType) => Promise<UserType>;
  signup: (data: SignupData) => Promise<void>;
  registerLibraryRequest: (data: LibraryRequestData) => void;
  approveLibraryRequest: (id: string) => void;
  rejectLibraryRequest: (id: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  location: string;
  type: UserType;
  phone?: string;
  avatar?: string;
  language?: string;
  theme?: string;
}

export interface LibraryRequestData {
  ownerName: string;
  libraryName: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  rccmNumber: string;
  taxpayerNumber: string;
  legalStatus: string;
  documents: UploadedDocument[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'bookmarket_auth_user';
const USERS_STORAGE_KEY = 'bookmarket_registered_users';
const REQUESTS_STORAGE_KEY = 'bookmarket_library_requests';
const ADMIN_USERS_STORAGE_KEY = 'bookmarket_admin_users';

export const DEMO_ACCOUNTS = [
  {
    email: 'client@bookstore.cm',
    password: 'Client@123',
    type: 'client' as UserType,
    name: 'Client test',
    id: 'client-1',
    location: 'Centre-ville, Yaoundé',
    phone: '+237 699 00 00 01',
  },
  {
    email: 'librairie@bookstore.cm',
    password: 'Librairie@123',
    type: 'librairie' as UserType,
    name: 'Librairie des Peuples Noirs',
    id: 'librairie-1',
    location: 'Centre-ville, Yaoundé',
    phone: '+237 222 21 44 04',
  },
  {
    email: 'admin@bookstore.cm',
    password: 'Admin@123',
    type: 'admin' as UserType,
    name: 'Administrateur BookStore',
    id: 'admin-1',
    location: 'Yaoundé, Cameroun',
    phone: '+237 690 00 00 00',
  },
  { email: 'client@bookstore.com', password: 'Client@123', type: 'client' as UserType, name: 'Client Test', id: 'client-1', location: 'Yaoundé, Cameroun', phone: '+237 699 00 00 01' },
  { email: 'librairie@bookstore.com', password: 'Librairie@123', type: 'librairie' as UserType, name: 'Librairie Test', id: 'librairie-1', location: 'Yaoundé, Cameroun', phone: '+237 222 21 44 04' },
  { email: 'admin@bookstore.com', password: 'Admin@123', type: 'admin' as UserType, name: 'Admin Test', id: 'admin-1', location: 'Yaoundé, Cameroun', phone: '+237 690 00 00 00' },
];

function readJSON<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toSessionUser(account: Pick<RegisteredUser, 'id' | 'name' | 'email' | 'type' | 'location' | 'phone' | 'city' | 'country'>): User {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    type: account.type,
    location: account.location,
    phone: account.phone,
    language: 'fr',
    theme: 'light',
    city: account.city || 'Yaoundé',
    country: account.country || 'Cameroun',
  };
}

function syncUserToAdminPlatform(account: RegisteredUser) {
  if (!account.type) return;
  const fallbackAdminUsers = DEMO_ACCOUNTS.filter((account) => account.type).map((account) => ({
    id: account.id,
    name: account.name,
    email: account.email,
    type: account.type as UserRole,
    role: account.type as UserRole,
    phone: account.phone || '',
    location: account.location || 'Non renseignée',
    city: account.location || 'Yaoundé',
    country: 'Cameroun',
    active: true,
    createdAt: '2026-01-01',
  }));
  const current = readJSON<any[]>(ADMIN_USERS_STORAGE_KEY, fallbackAdminUsers);
  const normalizedEmail = normalizeEmail(account.email);
  const alreadyExists = current.some((user) => normalizeEmail(user.email) === normalizedEmail);
  if (alreadyExists) return;

  const adminUser = {
    id: account.id,
    name: account.name,
    email: account.email,
    type: account.type as UserRole,
    role: account.type as UserRole,
    phone: account.phone || '',
    location: account.location || 'Non renseignée',
    city: account.city || account.location || 'Yaoundé',
    country: account.country || 'Cameroun',
    active: true,
    createdAt: account.createdAt || new Date().toISOString(),
  };
  writeJSON(ADMIN_USERS_STORAGE_KEY, [adminUser, ...current]);
  window.dispatchEvent(new CustomEvent('bookmarket_admin_users_updated', { detail: adminUser }));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readJSON<User | null>(AUTH_STORAGE_KEY, null));
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => readJSON<RegisteredUser[]>(USERS_STORAGE_KEY, []));
  const [libraryRequests, setLibraryRequests] = useState<LibraryRequest[]>(() => readJSON<LibraryRequest[]>(REQUESTS_STORAGE_KEY, []));

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(libraryRequests));
  }, [libraryRequests]);

  useEffect(() => {
    const refreshRequests = () => setLibraryRequests(readJSON<LibraryRequest[]>(REQUESTS_STORAGE_KEY, []));
    window.addEventListener('storage', refreshRequests);
    window.addEventListener('bookmarket_library_requests_updated', refreshRequests as EventListener);
    return () => {
      window.removeEventListener('storage', refreshRequests);
      window.removeEventListener('bookmarket_library_requests_updated', refreshRequests as EventListener);
    };
  }, []);

  const login = async (email: string, password: string, _userType: UserType): Promise<UserType> => {
    await new Promise(resolve => setTimeout(resolve, 250));

    const normalizedEmail = normalizeEmail(email);

    if (isAccountDisabled(normalizedEmail)) {
      throw new Error('Ce compte est désactivé. Contactez l’administrateur.');
    }

    const registered = registeredUsers.find(
      u => normalizeEmail(u.email) === normalizedEmail && u.password === password
    );
    if (registered) {
      const sessionUser = toSessionUser(registered);
      setUser(sessionUser);
      return registered.type;
    }

    const demo = DEMO_ACCOUNTS.find(
      a => normalizeEmail(a.email) === normalizedEmail && a.password === password
    );
    if (demo) {
      const sessionUser = toSessionUser(demo);
      setUser(sessionUser);
      return demo.type;
    }

    const pendingLibrary = libraryRequests.find(
      request => normalizeEmail(request.email) === normalizedEmail && request.status === 'pending'
    );
    if (pendingLibrary) {
      throw new Error('Votre demande de librairie est encore en attente de validation par l’administrateur.');
    }

    const rejectedLibrary = libraryRequests.find(
      request => normalizeEmail(request.email) === normalizedEmail && request.status === 'rejected'
    );
    if (rejectedLibrary) {
      throw new Error('Votre demande de librairie a été refusée. Contactez l’administrateur.');
    }

    throw new Error('Email ou mot de passe incorrect');
  };

  const signup = async (data: SignupData) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const normalizedEmail = normalizeEmail(data.email);
    const exists = registeredUsers.some(u => normalizeEmail(u.email) === normalizedEmail)
      || DEMO_ACCOUNTS.some(a => normalizeEmail(a.email) === normalizedEmail)
      || libraryRequests.some(r => normalizeEmail(r.email) === normalizedEmail && r.status === 'pending');
    if (exists) throw new Error('Cet email est déjà utilisé');

    const newUser: RegisteredUser = {
      id: `${data.type || 'user'}-${Date.now()}`,
      name: data.name.trim(),
      email: normalizedEmail,
      password: data.password,
      type: data.type,
      location: data.location,
      phone: data.phone,
      city: data.location,
      country: 'Cameroun',
      createdAt: new Date().toISOString(),
    };
    setRegisteredUsers(prev => [...prev, newUser]);
    syncUserToAdminPlatform(newUser);
  };

  const registerLibraryRequest = (data: LibraryRequestData) => {
    const normalizedEmail = normalizeEmail(data.email);
    const exists = registeredUsers.some(u => normalizeEmail(u.email) === normalizedEmail)
      || DEMO_ACCOUNTS.some(a => normalizeEmail(a.email) === normalizedEmail)
      || libraryRequests.some(r => normalizeEmail(r.email) === normalizedEmail && r.status === 'pending');
    if (exists) throw new Error('Cet email est déjà utilisé ou une demande est en cours');

    if (!data.documents || data.documents.length < 6) {
      throw new Error('Tous les documents obligatoires doivent être fournis.');
    }

    const request: LibraryRequest = {
      id: `lib-req-${Date.now()}`,
      ...data,
      email: normalizedEmail,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    setLibraryRequests(prev => {
      const next = [request, ...prev];
      writeJSON(REQUESTS_STORAGE_KEY, next);
      window.dispatchEvent(new CustomEvent('bookmarket_library_requests_updated', { detail: request }));
      return next;
    });
  };

  const approveLibraryRequest = (id: string) => {
    const request = libraryRequests.find(r => r.id === id);
    if (!request) return;

    const newUser: RegisteredUser = {
      id: `lib-${Date.now()}`,
      name: request.libraryName,
      email: request.email,
      password: request.password,
      type: 'librairie',
      location: request.location,
      phone: request.phone,
      city: request.city,
      country: request.country,
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers(users => {
      const alreadyExists = users.some(u => normalizeEmail(u.email) === normalizeEmail(request.email));
      if (alreadyExists) return users;
      return [...users, newUser];
    });
    syncUserToAdminPlatform(newUser);

    setLibraryRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
  };

  const rejectLibraryRequest = (id: string) => {
    setLibraryRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
  };

  const logout = () => setUser(null);

  const updateProfile = (data: Partial<User>) => {
    setUser(current => current ? { ...current, ...data } : current);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      registeredUsers,
      libraryRequests,
      login,
      signup,
      registerLibraryRequest,
      approveLibraryRequest,
      rejectLibraryRequest,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
