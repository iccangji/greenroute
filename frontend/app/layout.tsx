import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const displayFont = IBM_Plex_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.className} ${displayFont.style} antialiased`}
      >
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
