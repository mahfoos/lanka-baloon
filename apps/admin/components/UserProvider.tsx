"use client";

import { createContext, useContext } from "react";
import { permissionsFor, type Permissions, type SessionUser } from "@/lib/roles";

interface UserContextValue {
  user: SessionUser;
  permissions: Permissions;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user, permissions: permissionsFor(user.role) }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
