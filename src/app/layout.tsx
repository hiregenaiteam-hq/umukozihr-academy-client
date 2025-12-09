import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Header, Footer } from "@/components/layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl = "https://academy.umukozihr.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "UmukoziHR Academy - Africa's HR Knowledge Commons",
    template: "%s | UmukoziHR Academy",
  },
  description:
    "Africa's premier HR education platform. Expert insights on hiring, talent development, workplace leadership, and career guidance. Built by HR professionals, for Africa.",
  keywords: [
    "HR Africa",
    "Human Resources Africa",
    "African HR professionals",
    "Hiring in Africa",
    "Recruitment Africa",
    "Talent management Africa",
    "Career guidance Africa",
    "Workplace leadership",
    "HR best practices",
    "African job market",
    "HR training Africa",
    "Employee development",
    "UmukoziHR",
    "HR knowledge base",
    "African talent",
  ],
  authors: [{ name: "UmukoziHR", url: "https://umukozihr.com" }],
  creator: "UmukoziHR",
  publisher: "UmukoziHR",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "UmukoziHR Academy",
    title: "UmukoziHR Academy - Africa's HR Knowledge Commons",
    description:
      "Africa's premier HR education platform. Expert insights on hiring, talent development, workplace leadership, and career guidance for African professionals.",
    images: [
      {
        url: "/media/og-image.png",
        width: 1200,
        height: 630,
        alt: "UmukoziHR Academy - Africa's HR Knowledge Commons",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UmukoziHR Academy - Africa's HR Knowledge Commons",
    description:
      "Expert HR insights on hiring, talent development, and workplace leadership. Built for Africa.",
    images: ["/media/og-image.png"],
    creator: "@umukozihr",
    site: "@umukozihr",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Education",
  classification: "Human Resources Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "UmukoziHR Academy",
    description:
      "Africa's premier HR education platform providing expert insights on hiring, talent development, workplace leadership, and career guidance.",
    url: "https://academy.umukozihr.com",
    logo: "https://academy.umukozihr.com/media/logo.png",
    sameAs: [
      "https://linkedin.com/company/umukozihr",
      "https://twitter.com/umukozihr",
    ],
    parentOrganization: {
      "@type": "Organization",
      name: "UmukoziHR",
      url: "https://umukozihr.com",
    },
    areaServed: {
      "@type": "Continent",
      name: "Africa",
    },
    knowsAbout: [
      "Human Resources Management",
      "Talent Acquisition",
      "Recruitment in Africa",
      "Workplace Leadership",
      "Career Development",
      "Employee Training",
      "African Job Market",
      "HR Best Practices",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="theme-color" content="#1B4332" />
        <meta name="geo.region" content="AF" />
        <meta name="geo.placename" content="Africa" />
        <meta name="ICBM" content="0, 20" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="7 days" />
      </head>
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
