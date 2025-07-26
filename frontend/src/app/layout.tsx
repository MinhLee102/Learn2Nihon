import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Learn2Nihon",
  description: 'A Website for people who want to learn Japanese',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
              <Header />
              {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

