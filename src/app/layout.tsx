import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Coffee — Experience the Perfect Brew",
  description: "Explore premium coffee craftsmanship in stunning 3D. A scroll-driven visual experience.",
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
