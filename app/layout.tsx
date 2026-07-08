import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
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

export const metadata: Metadata = {
  title: "care3r | Web3 Jobs",
  description: "Discover remote Web3 jobs and crypto careers. Curated high-signal opportunities at protocols, funds, startups, and builder teams.",
  icons: {
    icon: "/favicon.ico",
  },
};

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
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-zinc-200">
        {/* Early suppression for noisy wallet extension errors (e.g. TronLink) */}
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

                  // Capture very early
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
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
