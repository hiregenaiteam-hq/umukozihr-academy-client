import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Header, Footer } from "@/components/layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "UmukoziHR Academy - Africa's HR Knowledge Commons",
    template: "%s | UmukoziHR Academy",
  },
  description:
    "Africa's premier HR education platform. Expert insights on hiring, talent development, and workplace leadership.",
  keywords: [
    "HR",
    "Human Resources",
    "Africa",
    "Hiring",
    "Recruitment",
    "Talent",
    "Career",
  ],
  authors: [{ name: "UmukoziHR" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://academy.umukozihr.com",
    siteName: "UmukoziHR Academy",
    title: "UmukoziHR Academy - Africa's HR Knowledge Commons",
    description:
      "Africa's premier HR education platform. Expert insights on hiring, talent development, and workplace leadership.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UmukoziHR Academy",
    description: "Africa's HR Knowledge Commons",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
