import { create } from 'zustand';
import { Role, UserProfile, DEMO_USERS } from './auth.types';

interface AuthState {
  currentRole: Role;
  currentUser: UserProfile;
  setRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentRole: 'CONTROLLER',
  currentUser: DEMO_USERS.CONTROLLER,
  setRole: (role: Role) =>
    set({
      currentRole: role,
      currentUser: DEMO_USERS[role],
    }),
}));
