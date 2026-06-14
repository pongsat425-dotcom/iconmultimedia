import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
// import FloatingContact from "@/components/layout/FloatingContact";
import { AuthProvider } from "@/lib/supabase/auth-context";
import { CartProvider } from "@/lib/cart/cart-context";
import { ToastProvider } from "@/lib/toast/toast-context";
import { FavoritesProvider } from "@/lib/favorites/favorites-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Icon Multimedia | ร้านขายคอมพิวเตอร์และอุปกรณ์ไอที",
    template: "%s | Icon Multimedia",
  },
  description: "ร้านขายคอมพิวเตอร์ โน้ตบุ๊ค อุปกรณ์ไอที ชิ้นส่วนประกอบ PC และบริการซ่อมครบวงจร โดย Icon Multimedia นครศรีธรรมราช ราคาดี มีประกัน บริการหลังการขายเยี่ยม",
  keywords: ["ร้านคอมพิวเตอร์", "ร้านไอที", "นครศรีธรรมราช", "Icon Multimedia", "ซ่อมคอม", "โน้ตบุ๊ค", "PC Components", "อุปกรณ์ไอที"],
  authors: [{ name: "Icon Multimedia" }],
  creator: "Icon Multimedia",
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "Icon Multimedia",
    title: "Icon Multimedia | ร้านขายคอมพิวเตอร์และอุปกรณ์ไอที",
    description: "ร้านขายคอมพิวเตอร์ โน้ตบุ๊ค อุปกรณ์ไอที และบริการซ่อมครบวงจร นครศรีธรรมราช",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "https://lpurpvlrcmzwkdmojahy.supabase.co/storage/v1/object/public/product-images/logo.png",
      },
      {
        url: "/logo.png",
      }
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <ToastProvider>
                <Navbar />
                <main className="flex-1 w-full">
                  {children}
                </main>
                <Footer />
                {/* <FloatingContact /> */}
              </ToastProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
