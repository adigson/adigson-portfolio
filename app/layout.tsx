import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Musibau Bolaji | Portfolio System",
  description:
    "The portfolio and live system dashboard of Musibau Bolaji: Node.js, product thinking, and community impact.",
  metadataBase: new URL("https://adigson.vercel.app"),
  openGraph: {
    title: "Musibau Bolaji | Portfolio System",
    description: "A live system dashboard for a builder who cares about people and products.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
