import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "CUSTOMER" | "ARTISAN_ADMIN" | "WORKSHOP_MAKER";

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "LOGIN" | "REGISTER";

  // Actions
  openAuthModal: (tab?: "LOGIN" | "REGISTER") => void;
  closeAuthModal: () => void;
  login: (
    identifier: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: string;
    errorType?: string;
    promptRegister?: boolean;
    wrongPassword?: boolean;
  }>;
  register: (data: {
    name: string;
    username: string;
    email?: string;
    phone?: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

function setRoleCookie(role: UserRole) {
  if (typeof document !== "undefined") {
    document.cookie = `art_aalay_role=${role}; path=/; max-age=2592000; SameSite=Lax`;
  }
}

function clearRoleCookie() {
  if (typeof document !== "undefined") {
    document.cookie = `art_aalay_role=; path=/; max-age=0; SameSite=Lax`;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      authModalTab: "LOGIN",

      openAuthModal: (tab = "LOGIN") => {
        set({ isAuthModalOpen: true, authModalTab: tab });
      },

      closeAuthModal: () => {
        set({ isAuthModalOpen: false });
      },

      login: async (identifier: string, password: string) => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, password }),
          });
          const data = await res.json();
          if (data.success && data.user) {
            setRoleCookie(data.user.role);
            set({
              user: data.user,
              isAuthenticated: true,
              isAuthModalOpen: false,
            });
            return { success: true };
          }
          return {
            success: false,
            error: data.error || "Invalid username or password. Please try again.",
            errorType: data.errorType,
            promptRegister: Boolean(data.promptRegister),
            wrongPassword: Boolean(data.wrongPassword),
          };
        } catch {
          return {
            success: false,
            error: "Network error occurred during sign in. Please try again.",
          };
        }
      },

      register: async ({ name, username, email, phone, password }) => {
        if (!name || !username || !password) {
          return { success: false, error: "Please fill in all required fields." };
        }

        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, username, email, phone, password }),
          });
          const data = await res.json();
          if (data.success && data.user) {
            setRoleCookie(data.user.role);
            set({
              user: data.user,
              isAuthenticated: true,
              isAuthModalOpen: false,
            });
            return { success: true };
          }
          return {
            success: false,
            error: data.error || "Failed to create account.",
          };
        } catch {
          return {
            success: false,
            error: "Network error occurred during registration. Please try again.",
          };
        }
      },

      logout: () => {
        clearRoleCookie();
        fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "art_aalay_auth",
    }
  )
);
