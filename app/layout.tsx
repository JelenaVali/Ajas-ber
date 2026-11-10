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
      <body className="min-h-dvh antialiased">
        {children}
        {/* Jalus on iga lehe sisu all, et see ei segaks lapse nuppe. */}
        <footer className="px-4 py-6 text-center text-sm font-semibold text-ink/70">
          {messages.footer.text}
        </footer>
      </body>
    </html>
  );
}
