import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { LanguageProvider } from "./context/LanguageContext";
import CookieBanner from "./components/CookieBanner";

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PHProvider, PostHogPageview } from "./PostHogProvider";
import { Suspense } from "react";
import { WebAnalytics } from "./components/WebAnalytics";
import { geist, geistMono, kelson } from "./fonts";

export const metadata: Metadata = {
  title: "Sapienza Foiling Team",
  description: "Sapienza Foiling Team",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} ${kelson.variable} antialiased`}>
        <PHProvider>
        <WebAnalytics />
        <Suspense>
          <PostHogPageview />
        </Suspense>
          <LanguageProvider>
            <Navbar />
            {children}
            <Footer />
            <Analytics/>
            <SpeedInsights/>
            <CookieBanner/>
          </LanguageProvider>
        </PHProvider>
      </body>
    </html>
  );
}
