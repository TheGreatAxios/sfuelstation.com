import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "sFUEL Station | SKALE Network",
    template: "%s | sFUEL Station"
  },
  description: "Claim sFUEL (SKALE Fuel) for all SKALE Network chains. Get free sFUEL tokens for Calypso, Europa, Nebula, and Titan chains on both mainnet and testnet.",
  keywords: [
    "sFUEL",
    "SKALE Network",
    "blockchain",
    "cryptocurrency",
    "gas token",
    "Calypso",
    "Europa",
    "Nebula",
    "Titan",
    "faucet",
    "testnet",
    "mainnet",
    "Web3",
    "Ethereum",
    "layer 2",
    "scalability"
  ],
  authors: [{ name: "SKALE Network" }],
  creator: "SKALE Network",
  publisher: "SKALE Network",
  metadataBase: new URL("https://sfuelstation.com"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sfuelstation.com",
    siteName: "sFUEL Station",
    title: "sFUEL Station | SKALE Network",
    description: "Claim sFUEL (SKALE Fuel) for all SKALE Network chains. Get free sFUEL tokens for Calypso, Europa, Nebula, and Titan chains on both mainnet and testnet.",
    images: [
      {
        url: "/sfuel.png",
        width: 1200,
        height: 630,
        alt: "sFUEL Station - SKALE Network",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "sFUEL Station | SKALE Network",
    description: "Claim sFUEL (SKALE Fuel) for all SKALE Network chains. Get free sFUEL tokens for Calypso, Europa, Nebula, and Titan chains.",
    images: ["/sfuel.png"],
    creator: "@SKALENetwork"
  },
  icons: {
    icon: [
      { url: "/sfuel.png", type: "image/png" },
      { url: "/sfuel.png", sizes: "32x32", type: "image/png" },
      { url: "/sfuel.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [
      { url: "/sfuel.png", type: "image/png" }
    ],
    shortcut: "/sfuel.png"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: undefined, // Add Google Search Console verification if available
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

