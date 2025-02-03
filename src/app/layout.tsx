import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import ScrollLinked from "./components/global/ScrollLinked";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nikoloz Shekiladze - Web/Mobile Developer",
  description:
    "Portfolio of Nikoloz Shekiladze, a full-stack developer specializing in web and mobile development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root">
          <ThemeProvider>
            <ScrollLinked></ScrollLinked>
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
