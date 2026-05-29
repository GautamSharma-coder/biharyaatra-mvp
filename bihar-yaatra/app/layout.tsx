import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

// 1. Setup Space Grotesk (Body Font)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

// 2. Setup Syne (Heading Font)
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bihar Yaatra - Discover the Soul of India",
  description:
    "Book immersive tours to Bodh Gaya, Nalanda, Rajgir, and more. Experience the rich heritage, spirituality, and nature of Bihar with verified guides.",
  keywords:
    "Bihar tourism, Bodh Gaya tours, Nalanda university, Rajgir tourism, Bihar travel packages, spiritual tourism India, eco tourism bihar",
  authors: [{ name: "Bihar Yaatra" }],
};

import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      {/* Add suppressHydrationWarning here 👇 */}
      <body
        className={`${spaceGrotesk.variable} ${syne.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}