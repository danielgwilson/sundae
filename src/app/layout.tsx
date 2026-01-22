import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Fragment_Mono, Instrument_Sans, Unbounded } from "next/font/google";
import { PixelCloudGrid } from "@/components/brand/pixel-cloud-grid";
import "./globals.css";

const brandSans = Instrument_Sans({
  variable: "--font-brand-sans",
  subsets: ["latin"],
});

const brandDisplay = Unbounded({
  variable: "--font-brand-display",
  subsets: ["latin"],
});

const brandMono = Fragment_Mono({
  variable: "--font-brand-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Sundae",
  description:
    "A creator homepage that turns taps into subscribers and customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${brandSans.variable} ${brandDisplay.variable} ${brandMono.variable} antialiased`}
      >
        <PixelCloudGrid />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
