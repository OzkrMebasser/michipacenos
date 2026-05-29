import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import { Fredoka, Nunito, DynaPuff } from "next/font/google";

import "./globals.css";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const dynaPuff = DynaPuff({
  subsets: ["latin"],
  variable: "--font-dynapuff",
});

export const metadata: Metadata = {
  title: "Michi Paceños",
  description:
    "Michipaceños es una asociación la cual brinda campañas de esterilización a bajo costo, ferias de adopción y TNR (atrapar, esterilizar y soltar) como nuestra principal actividad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`
        ${fredoka.variable}
        ${nunito.variable}
        ${dynaPuff.variable}
        h-full antialiased
      `}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
          <WhatsAppButton />
         <Footer />
      </body>
    </html>
  );
}
