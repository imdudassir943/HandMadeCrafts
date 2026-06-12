import type { Metadata } from "next";
import AboutDeveloper from "@/components/AboutDeveloper";

export const metadata: Metadata = {
  title: "About the Developer - Mudassir Sharif | Aura Crafts",
  description: "Meet Mudassir Sharif, Python Developer, Django Backend Developer, and MERN Stack Learner. He is the creator of the Aura Crafts platform.",
};

export default function AboutDeveloperPage() {
  return (
    <main className="min-h-screen">
      <AboutDeveloper />
    </main>
  );
}
