"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { getMe } from "@/lib/api/auth";

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !store.user) {
      store.setLoading(true);
      getMe()
        .then((user) => {
          store.setUser(user);
        })
        .catch(() => {
          store.logout();
        });
    } else if (!token) {
      store.setLoading(false);
    }
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return store;
}
