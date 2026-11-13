import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const ogImage = `${protocol}://${host}/og-v6.png`;

  return {
    title: "Emma Wu's Personal Website",
    description: "Meet Emma Wu: UCLA Statistics and Data Science, professional experience, and a playful 3D portfolio.",
    openGraph: {
      title: "Emma Wu's Personal Website",
      description: "Get to know Emma Wu, explore her experience in data and tech, and step into her interactive 3D plaza.",
      type: "website",
      images: [{ url: ogImage, width: 1600, height: 900, alt: "Emma Wu on a soft lavender background" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Emma Wu's Personal Website",
      description: "Data, stories, and curiosity. Explore Emma Wu’s portfolio in regular or 3D mode.",
      images: [ogImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
