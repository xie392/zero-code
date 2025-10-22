import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";
import Hydration from "./hydration";

import QueryProvider from "@/components/providers/query-provider";
import QueryHydrationProvider from "@/components/providers/query-hydration-provider";
import AuthProvider from "@/components/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zero Code",
  description:
    "Zero Code is a platform that helps you build your own applications without writing any code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <QueryHydrationProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryHydrationProvider>
        </QueryProvider>
        <Toaster position="top-center" visibleToasts={3} closeButton />
      </body>
    </html>
  );
}
