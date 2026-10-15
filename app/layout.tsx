import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import CommandPalette from "@/components/CommandPalette";
import Footer from "@/components/Footer";
import ClientErrorSuppressor from "@/components/ClientErrorSuppressor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = "https://care3r.vercel.app";
const DESCRIPTION =
  "Curated remote Web3 jobs and crypto careers for builders, operators, and crypto-native talent. High-signal roles at protocols, funds, and startups, plus a free CV Power Score.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "care3r | Curated Web3 Jobs", template: "%s" },
  description: DESCRIPTION,
  applicationName: "care3r",
  keywords: ["web3 jobs", "crypto jobs", "remote crypto careers", "blockchain jobs", "defi jobs", "CV score"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "care3r",
    url: SITE,
    title: "care3r | Curated Web3 Jobs",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "care3r | Curated Web3 Jobs", description: DESCRIPTION },
  icons: { icon: "/favicon.ico" },
};

export const viewport = { themeColor: "#050308" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="flex min-h-dvh flex-col bg-[#050308] text-zinc-200">
        <Script
          id="suppress-wallet-injection-errors"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  function isWalletNoise(msg) {
                    if (!msg) return false;
                    var m = String(msg).toLowerCase();
                    return m.indexOf('tronlinkparams') !== -1 ||
                           m.indexOf('tronlink') !== -1 ||
                           m.indexOf('set on proxy') !== -1 ||
                           m.indexOf('trap returned falsish') !== -1;
                  }
                  var add = EventTarget.prototype.addEventListener;
                  add.call(window, 'unhandledrejection', function(e) {
                    var r = e && e.reason;
                    var msg = (typeof r === 'string' ? r : (r && (r.message || (r.toString && r.toString()))) || '');
                    if (isWalletNoise(msg)) {
                      try { e.preventDefault && e.preventDefault(); } catch(_) {}
                    }
                  }, true);
                  add.call(window, 'error', function(e) {
                    if (isWalletNoise(e && e.message)) {
                      try { e.preventDefault && e.preventDefault(); } catch(_) {}
                    }
                  }, true);
                } catch(_) {}
              })();
            `,
          }}
        />
        <ClientErrorSuppressor />
        <Navbar />
        <CommandPalette />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
