import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "ShopNext — Premium E-Commerce",
    template: "%s | ShopNext",
  },
  description:
    "Discover thousands of products across electronics, clothing, books, home & garden, and sports. Fast shipping, easy returns.",
  keywords: ["ecommerce", "shop", "online store", "buy", "products"],
  authors: [{ name: "ShopNext Team" }],
  creator: "ShopNext",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "ShopNext",
    title: "ShopNext — Premium E-Commerce",
    description:
      "Discover thousands of products across electronics, clothing, books, home & garden, and sports.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopNext — Premium E-Commerce",
    description:
      "Discover thousands of products across electronics, clothing, books, home & garden, and sports.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
