import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "AI Placement Mentor",
  description: "A premium placement preparation platform for students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full antialiased font-sans")}
    >
      <body className="min-h-full flex flex-col bg-base text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
