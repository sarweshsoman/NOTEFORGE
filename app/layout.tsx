import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Noteforge",
  description: "Work APP",
  icons : {
    icon: [
      {
        media: "(prefers-color-scheme: light",
        url: "/pirate-svgrepo-com.svg",
        href: "/pirate-svgrepo-com.svg",
      },
      {
        media: "(prefers-color-scheme: dark",
        url: "/pirate-svgrepo-com.svg",
        href: "/pirate-svgrepo-com.svg",
      },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
          <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="noteforge-theme"
        >
          <Toaster position ="bottom-center"/>
          <ModalProvider />
        {children}
        </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
        </body>
    </html>
  );
}
