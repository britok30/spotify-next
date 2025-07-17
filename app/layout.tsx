import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { SpotifyProvider } from "@/contexts/SpotifyContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Clone",
  description:
    "A modern Spotify clone built with Next.js, TypeScript, and Clerk Auth",
  keywords: ["spotify", "music", "streaming", "nextjs", "typescript"],
  authors: [{ name: "Your Name" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#18D860",
          colorBackground: "#000000",
          colorInputBackground: "#1a1a1a",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#b3b3b3",
        },
        elements: {
          formButtonPrimary: "bg-[#18D860] hover:bg-[#109643]",
          card: "bg-black border border-gray-800",
          headerTitle: "text-white",
          headerSubtitle: "text-gray-400",
        },
      }}
    >
      <html lang="en" className="scrollbar">
        <body
          className={`bg-black text-white font-sans antialiased ${inter.className} scrollbar `}
        >
          <SpotifyProvider>{children}</SpotifyProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
