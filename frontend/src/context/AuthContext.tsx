"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface RegisteredUser extends User {
  password?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: { en: string; ur: string } }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: { en: string; ur: string } }>;
  logout: () => void;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("handmade_auth_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse auth user", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Get registered users from localStorage
    const usersRaw = localStorage.getItem("handmade_registered_users");
    const registeredUsers: RegisteredUser[] = usersRaw ? JSON.parse(usersRaw) : [];

    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const loggedUser = { name: foundUser.name, email: foundUser.email };
      setUser(loggedUser);
      localStorage.setItem("handmade_auth_user", JSON.stringify(loggedUser));
      return { success: true };
    }

    // Default admin credential for testing
    if (email.toLowerCase() === "admin@auracrafts.com" && password === "password123") {
      const adminUser = { name: "Aura Admin", email: "admin@auracrafts.com" };
      setUser(adminUser);
      localStorage.setItem("handmade_auth_user", JSON.stringify(adminUser));
      return { success: true };
    }

    return {
      success: false,
      error: {
        en: "Invalid email or password. Hint: admin@auracrafts.com / password123",
        ur: "غلط ای میل یا پاس ورڈ۔ اشارہ: admin@auracrafts.com / password123",
      },
    };
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const usersRaw = localStorage.getItem("handmade_registered_users");
    const registeredUsers: RegisteredUser[] = usersRaw ? JSON.parse(usersRaw) : [];

    const emailExists = registeredUsers.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists || email.toLowerCase() === "admin@auracrafts.com") {
      return {
        success: false,
        error: {
          en: "This email address is already registered.",
          ur: "یہ ای میل ایڈریس پہلے سے ہی رجسٹرڈ ہے۔",
        },
      };
    }

    const newUser = { name, email, password };
    const updatedUsers = [...registeredUsers, newUser];
    localStorage.setItem("handmade_registered_users", JSON.stringify(updatedUsers));

    const loggedUser = { name, email };
    setUser(loggedUser);
    localStorage.setItem("handmade_auth_user", JSON.stringify(loggedUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("handmade_auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
