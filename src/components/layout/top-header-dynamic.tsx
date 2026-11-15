"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { TopHeader } from "./top-header";

interface UserSession {
  name?: string | null;
  email?: string | null;
}

export function TopHeaderDynamic() {
  const [user, setUser] = useState<UserSession>({ name: "João Silva" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.name) {
            // Extract first name only for the greeting
            const firstName = data.name.split(" ")[0];
            setUser({ name: firstName, email: data.email });
            return;
          }
        }
        // Fallback if auth fails or no name
        setUser((prev) => prev.name ? prev : { name: "Usuário", email: null });
      } catch {
        setUser((prev) => prev.name ? prev : { name: "Usuário", email: null });
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return <div className="h-16" />;
  }

  const displayName = user.name || "João Silva";
  return <TopHeader userName={displayName} userRole="CLIENT" />;
}
