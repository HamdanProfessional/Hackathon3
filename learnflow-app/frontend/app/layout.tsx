import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LearnFlow - AI-Powered Python Learning",
  description: "Learn Python programming with AI-powered tutoring and interactive exercises",
  icons: {
    icon: '/favicon.ico',
  },
};
// Build: dd18d8c8 - Environment variables added

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Starfield Background */}
        <div className="starfield">
          <div className="nebula-glow" />
          <div className="dust-particles" />
          <div className="stars stars-small" />
          <div className="stars stars-medium" />
          <div className="stars stars-large" />
          <div className="shooting-star" />
          <div className="shooting-star" />
          <div className="shooting-star" />
        </div>

        {/* Main content - positioned above stars */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
