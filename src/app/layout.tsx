import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studio FX Estate — AI cinematic walkthroughs for luxury property",
  description:
    "A creative AI studio that turns listing photos, renders and floor plans into cinematic walkthroughs of luxury homes. No cameras, crews or drones on site.",
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
