import { ID, Models } from "appwrite";
import React, { createContext, useContext, useEffect, useState } from "react";
import { account } from "../lib/appwrite";
import { toast as showToast } from "../lib/toast";

interface UserContextType {
  current: Models.User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  toast: (message: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}

export function UserProvider({ children }: React.PropsWithChildren<unknown>) {
  const [user, setUser] = useState<Models.User | null>(null);

  async function login(email: string, password: string) {
    try {
      // create a session with email & password
      await account.createEmailPasswordSession({ email, password });
      // fetch the current user and store in state
      const loggedIn = await account.get();
      setUser(loggedIn as Models.User);
      showToast("Welcome back. You are logged in");
    } catch (err: any) {
      console.error("Login error", err);
      // appwrite errors usually have a message property
      showToast(err?.message ?? "Failed to log in");
      throw err;
    }
  }

  async function logout() {
    try {
      await account.deleteSession({ sessionId: "current" });
      setUser(null);
      showToast("Logged out");
    } catch (err: any) {
      console.error("Logout error", err);
      showToast(err?.message ?? "Failed to log out");
      throw err;
    }
  }

  async function register(email: string, password: string, name?: string) {
    try {
      // create account with optional name
      await account.create({ userId: ID.unique(), email, password, name });
      // After registering, create session and fetch user
      await login(email, password);
      showToast("Account created");
    } catch (err: any) {
      console.error("Register error", err);
      showToast(err?.message ?? "Failed to create account");
      throw err;
    }
  }

  async function init() {
    try {
      const loggedIn = await account.get();
      setUser(loggedIn as Models.User);
      showToast("Welcome back. You are logged in");
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    init();
  }, []);

  const value: UserContextType = {
    current: user,
    login,
    logout,
    register,
    toast: showToast,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
