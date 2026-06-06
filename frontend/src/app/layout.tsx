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

export const metadata: Metadata = {
  title: "Aura Crafts - Premium Handmade Home Décor",
  description: "Sourcing exquisite handmade home treasures crafted by skilled global artisans. High contrast, mobile-first, and fully accessible decor website.",
};

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
                <Footer />
              </body>
            </html>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
