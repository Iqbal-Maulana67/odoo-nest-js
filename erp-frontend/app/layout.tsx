// app/layout.tsx
import Providers from "./providers";
import "./globals.css";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.className}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
