import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
// import NextAuthProvider from "@/lib";

import { TRPCReactProvider } from "@/trpc/react";
import Navbar from "@/components/layout/navbar";
import NextAuthProvider from "@/lib/auth/NextAuthProvider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "HeartSpring",
  description: "Pure water for pure living",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider cookies={cookies().toString()}>
            <NextAuthProvider>
              <Navbar />
              <main className="container">{children}</main>
              {/* // TODO footer */}
            </NextAuthProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
