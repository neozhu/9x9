import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { Footer } from "./footer";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "9×9乘法口诀 - 数学学习应用",
  description: "专为手机和iPad优化的9×9乘法口诀学习应用，帮助孩子轻松掌握乘法表",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

// 数学背景装饰组件
function MathBackground() {
  const mathSymbols = [
    // 数字
    { symbol: "1", x: "5%", y: "10%", size: "text-4xl", rotation: "rotate-12" },
    { symbol: "2", x: "15%", y: "75%", size: "text-3xl", rotation: "-rotate-6" },
    { symbol: "3", x: "85%", y: "20%", size: "text-5xl", rotation: "rotate-45" },
    { symbol: "4", x: "92%", y: "80%", size: "text-2xl", rotation: "-rotate-12" },
    { symbol: "5", x: "70%", y: "60%", size: "text-3xl", rotation: "rotate-6" },
    { symbol: "6", x: "25%", y: "30%", size: "text-4xl", rotation: "-rotate-12" },
    { symbol: "7", x: "60%", y: "15%", size: "text-2xl", rotation: "rotate-24" },
    { symbol: "8", x: "10%", y: "45%", size: "text-3xl", rotation: "-rotate-6" },
    { symbol: "9", x: "80%", y: "40%", size: "text-4xl", rotation: "rotate-12" },
    
    // 乘法符号
    { symbol: "×", x: "40%", y: "20%", size: "text-6xl", rotation: "rotate-12" },
    { symbol: "×", x: "75%", y: "85%", size: "text-3xl", rotation: "-rotate-12" },
    { symbol: "×", x: "30%", y: "65%", size: "text-4xl", rotation: "rotate-6" },
    
    // 等号
    { symbol: "=", x: "50%", y: "85%", size: "text-3xl", rotation: "-rotate-6" },
    { symbol: "=", x: "90%", y: "55%", size: "text-2xl", rotation: "rotate-12" },
    
    // 数学符号表情
    { symbol: "📐", x: "20%", y: "55%", size: "text-3xl", rotation: "rotate-45" },
    { symbol: "📏", x: "65%", y: "75%", size: "text-2xl", rotation: "-rotate-12" },
    { symbol: "🧮", x: "45%", y: "10%", size: "text-4xl", rotation: "rotate-6" },
    { symbol: "➕", x: "35%", y: "85%", size: "text-2xl", rotation: "-rotate-12" },
    { symbol: "➖", x: "85%", y: "65%", size: "text-2xl", rotation: "rotate-12" },
    
    // 更多数字
    { symbol: "12", x: "55%", y: "35%", size: "text-xl", rotation: "-rotate-6" },
    { symbol: "18", x: "25%", y: "20%", size: "text-xl", rotation: "rotate-12" },
    { symbol: "24", x: "70%", y: "25%", size: "text-xl", rotation: "-rotate-12" },
    { symbol: "36", x: "15%", y: "65%", size: "text-xl", rotation: "rotate-6" },
    { symbol: "81", x: "45%", y: "70%", size: "text-xl", rotation: "rotate-6" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {mathSymbols.map((item, index) => (
        <div
          key={index}
          className={`absolute ${item.size} ${item.rotation} font-mono text-primary/20 dark:text-primary/15 select-none transition-all duration-1000 animate-pulse`}
          style={{
            left: item.x,
            top: item.y,
            animationDelay: `${index * 0.3}s`,
            animationDuration: `${4 + (index % 2)}s`,
          }}
        >
          {item.symbol}
        </div>
      ))}
      
      {/* 几何图形装饰 */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-primary/10 rounded-full opacity-30 animate-spin" style={{ animationDuration: '25s' }}></div>
      <div className="absolute top-3/4 right-1/4 w-12 h-12 border-2 border-primary/10 rotate-45 opacity-30 animate-bounce" style={{ animationDuration: '5s' }}></div>
      <div className="absolute top-1/2 left-1/6 w-8 h-16 border-l-2 border-primary/10 opacity-30 transform rotate-12"></div>
      <div className="absolute bottom-1/4 right-1/6 w-20 h-1 bg-primary/10 opacity-30 transform -rotate-12"></div>
      
      {/* 更多几何装饰 */}
      <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-primary/5 rounded-full opacity-40"></div>
      <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-primary/5 rotate-45 opacity-40"></div>
    </div>
  );
}

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MathBackground />
          <div className="min-h-screen flex flex-col relative z-10">
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
