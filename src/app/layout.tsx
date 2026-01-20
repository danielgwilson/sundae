import type { Metadata } from "next";
import { DM_Mono, Epilogue, Fraunces } from "next/font/google";
import "./globals.css";

const sundaeSans = Epilogue({
  variable: "--font-sundae-sans",
  subsets: ["latin"],
});

const sundaeDisplay = Fraunces({
  variable: "--font-sundae-display",
  subsets: ["latin"],
});

const sundaeMono = DM_Mono({
  variable: "--font-sundae-mono",
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
        className={`${sundaeSans.variable} ${sundaeDisplay.variable} ${sundaeMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
