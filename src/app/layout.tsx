import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studio FX Estate — Cinematic property tours",
  description:
    "FPV drone walkthroughs that let buyers walk through the door before they book a viewing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
