
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import "./custom.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aurora Cafè",
  description: "Il tuo e-commerce di caffè preferito",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-100">
      <body className={`${inter.className} d-flex flex-column h-100`}>
        <CartProvider>
          <Navbar />
          <main className="container py-4 flex-shrink-0">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
