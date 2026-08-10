import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HockeyLab | Academia Hockey Greenhouse",
  description: "Portal de apoderados y administración de HockeyLab",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-rink-100 text-rink-900 font-body min-h-screen">{children}</body>
    </html>
  );
}
