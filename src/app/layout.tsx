import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GuateLife · Bares, restaurantes y spots de Guatemala",
  description:
    "Descubre los bares, discotecas, restaurantes y spots más recomendados de Guatemala, con las actividades de hoy y qué tan cerca están de ti.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-950 text-white">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="text-lg font-bold tracking-tight">
              📍 Guate<span className="text-fuchsia-500">Life</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="text-white/70 hover:text-white">
                Explorar
              </Link>
              <Link href="/novedades" className="text-white/70 hover:text-white">
                Novedades
              </Link>
              <Link
                href="/anunciate"
                className="rounded-full bg-fuchsia-600 px-4 py-1.5 font-medium text-white hover:bg-fuchsia-500"
              >
                Anúnciate aquí
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-white/10 py-8 text-center text-sm text-white/40">
          <p>GuateLife · Bares, restaurantes y spots de Guatemala.</p>
          <p className="mt-1">
            ¿Tienes un negocio?{" "}
            <Link href="/anunciate" className="text-fuchsia-400 hover:underline">
              Publica tu lugar aquí
            </Link>{" "}
            ·{" "}
            <Link href="/novedades" className="text-fuchsia-400 hover:underline">
              Suscríbete al newsletter
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
