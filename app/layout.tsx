import type { Metadata } from "next";
import { Nunito } from "next/font/google"; // Changed from Geist
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { Footer } from "./footer";
import { Analytics } from "@vercel/analytics/next"

const nunito = Nunito({ // Changed from Geist
  variable: "--font-sans", // Updated variable name to reflect usage
  subsets: ["latin"],
  weight: ["400", "700"], // Added weights for flexibility
});

// Assuming Geist Mono is still desired for mono, otherwise it can be removed or replaced
import { Geist_Mono } from "next/font/google";
const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "9×9乘法口诀 - 数学学习应用",
  description: "专为手机和iPad优化的9×9乘法口诀学习应用，帮助孩子轻松掌握乘法表",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="乘法口诀" />
      </head>
      <body
        className={`${nunito.variable} ${geistMono.variable} antialiased`} // Updated to use nunito
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed inset-0 z-[-1] overflow-hidden floating-shapes-container">
            {/* Shapes will be added here via CSS or could be dynamically generated */}
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
          <div className="min-h-screen flex flex-col relative z-10"> {/* Ensure content is above shapes */}
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
