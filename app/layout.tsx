import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini Audit Trail Generator",
  description: "Track text changes with automatic version history",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

