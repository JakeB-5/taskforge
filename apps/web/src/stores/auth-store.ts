"use client";

import { create } from "zustand";
import type { User } from "@taskforge/shared";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: false,
  isLoading: true,

  login: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: true, isLoading: false });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
