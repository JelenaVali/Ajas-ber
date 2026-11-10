import type { Metadata, Viewport } from "next";
import { getMessages } from "@/lib/i18n";
import "./globals.css";

const messages = getMessages();

export const metadata: Metadata = {
  title: messages.app.name,
  description: messages.app.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffaf2",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="et">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
