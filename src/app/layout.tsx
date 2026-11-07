import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HER UNIVERSE | An Interactive Birthday Journey",
  description: "A cinematic, living interactive fantasy universe made entirely for her birthday.",
  keywords: ["birthday", "universe", "cinematic", "interactive", "love story", "3D"],
  authors: [{ name: "Her Universe Studio" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#10051F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof window!=='undefined'){var orig=console.warn;console.warn=function(){if(arguments[0]&&typeof arguments[0]==='string'&&arguments[0].indexOf('THREE.Clock')!==-1)return;orig.apply(console,arguments);};}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-[#10051F] text-[#FFF1E6] antialiased selection:bg-[#D95BCB]/30 selection:text-[#FFF1E6] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
