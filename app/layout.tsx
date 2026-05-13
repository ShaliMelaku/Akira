import type { Metadata } from "next";
import { Inter, Outfit } from 'next/font/google';
import "./globals.css";
import GlobalUI from "@/components/public/GlobalUI";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: "Akira V3 — Elite",
  description: "Official website of Akira — Voiceover Actor, Film & Stage Actor, and Social Media Influencer from Ethiopia. Book premium voiceover, acting, and brand collaboration services.",
  keywords: ["Akira", "voiceover actor Ethiopia", "film actor", "stage actor", "social media influencer", "Ethiopian actor", "voiceover services"],
  openGraph: {
    title: "Akira — Voice. Presence. Performance.",
    description: "Premium voiceover, acting, and brand collaboration services from Ethiopia.",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Akira Studio",
  },
};

export const viewport = {
  themeColor: "#ff4d00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
          <div className="bg-gradient" suppressHydrationWarning />
          <GlobalUI />
          {children}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(reg) {
                      reg.onupdatefound = () => {
                        const installingWorker = reg.installing;
                        installingWorker.onstatechange = () => {
                          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available! Force reload
                            window.location.reload();
                          }
                        };
                      };
                    });
                  });
                }
              `,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
