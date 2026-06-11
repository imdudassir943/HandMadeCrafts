import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ThemeToggle from "@/components/ThemeToggle";
import InteractiveCursor from "@/components/InteractiveCursor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

import { API_BASE_URL } from "@/config";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/settings/`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.siteTitle || "Aura Crafts - Premium Handmade Home Décor",
        description: data.heroSub || "Sourcing exquisite handmade home treasures...",
      };
    }
  } catch (e) {
    console.error("Failed to load metadata dynamically", e);
  }
  return {
    title: "Aura Crafts - Premium Handmade Home Décor",
    description: "Sourcing exquisite handmade home treasures crafted by skilled global artisans.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
              <head>
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      try {
                        const theme = localStorage.getItem('handmade_theme');
                        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                          document.documentElement.classList.add('dark');
                        } else {
                          document.documentElement.classList.remove('dark');
                        }
                      } catch (_) {}
                    `
                  }}
                />
              </head>
              <body className="antialiased min-h-screen flex flex-col justify-between">
                <Navbar />
                <main className="flex-grow">
                  {children}
                </main>
                <CartDrawer />
                <ThemeToggle />
                <InteractiveCursor />
                <Footer />
              </body>
            </html>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
