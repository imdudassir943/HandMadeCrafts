"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

import { API_BASE_URL } from "@/config";

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("handmade_access_token");
    localStorage.removeItem("handmade_refresh_token");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("handmade_access_token");
      if (accessToken) {
        try {
          const res = await fetch(`${API_BASE_URL}/accounts/me/`, {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setUser({ name: data.name, email: data.email });
          } else {
            const refreshToken = localStorage.getItem("handmade_refresh_token");
            if (refreshToken) {
              const refreshRes = await fetch(`${API_BASE_URL}/accounts/token/refresh/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refreshToken }),
              });
              if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                localStorage.setItem("handmade_access_token", refreshData.access);
                const retryRes = await fetch(`${API_BASE_URL}/accounts/me/`, {
                  headers: { "Authorization": `Bearer ${refreshData.access}` },
                });
                if (retryRes.ok) {
                  const data = await retryRes.json();
                  setUser({ name: data.name, email: data.email });
                } else {
                  logout();
                }
              } else {
                logout();
              }
            } else {
              logout();
            }
          }
        } catch (e) {
          console.error("Auth check failed", e);
        }
      }
      setIsLoaded(true);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/accounts/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser({ name: data.user.name, email: data.user.email });
        localStorage.setItem("handmade_access_token", data.access);
        localStorage.setItem("handmade_refresh_token", data.refresh);
        return { success: true };
      } else {
        return {
          success: false,
          error: {
            en: data.detail || "Invalid email or password.",
            ur: "غلط ای میل یا پاس ورڈ۔",
          },
        };
      }
    } catch (e) {
      return {
        success: false,
        error: {
          en: "Server connection failed.",
          ur: "سرور سے رابطہ ناکام رہا۔",
        },
      };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/accounts/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser({ name: data.user.name, email: data.user.email });
        localStorage.setItem("handmade_access_token", data.access);
        localStorage.setItem("handmade_refresh_token", data.refresh);
        return { success: true };
      } else {
        let errMsgEn = "Registration failed.";
        let errMsgUr = "رجسٹریشن ناکام رہی۔";
        if (data.email) {
          errMsgEn = data.email[0];
          errMsgUr = "یہ ای میل ایڈریس پہلے سے ہی رجسٹرڈ ہے۔";
        }
        return {
          success: false,
          error: {
            en: errMsgEn,
            ur: errMsgUr,
          },
        };
      }
    } catch (e) {
      return {
        success: false,
        error: {
          en: "Server connection failed.",
          ur: "سرور سے رابطہ ناکام رہا۔",
        },
      };
    }
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
