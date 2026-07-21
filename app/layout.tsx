import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const ogImage = `${protocol}://${host}/og-v4.png`;

  return {
    title: "Emma Wu’s Little Plaza",
    description: "Explore Emma Wu’s playful 3D food-cart portfolio plaza.",
    openGraph: {
      title: "Emma Wu’s Little Plaza",
      description: "Explore a cozy 3D plaza to learn about Emma, her experience, and how to get in touch.",
      type: "website",
      images: [{ url: ogImage, width: 1731, height: 909, alt: "Emma Wu’s cozy 3D food-cart plaza" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Emma Wu’s Little Plaza",
      description: "A playful 3D food-cart portfolio.",
      images: [ogImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
