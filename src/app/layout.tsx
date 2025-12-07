import type { Metadata } from "next";
import { Outfit, Space_Grotesk, Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "./provider";
import Navbar from "./Navbar";
import Footer from "./Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const space = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nova Bot Studio",
  description:
    "Create, customize, and manage powerful AI bots — all in one unified platform.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${space.variable} ${poppins.variable} ${inter.variable} antialiased`}
      >
        <Provider>
          <Navbar />
          {children}

          <Footer />
        </Provider>
      </body>
    </html>
  );
}

