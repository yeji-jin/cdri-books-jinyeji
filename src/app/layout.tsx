import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "@/shared/providers";
import { GlobalHeader } from "@/components/GlobalHeader";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"], 
  weight: ["400", "500", "700"], 
});

export const metadata: Metadata = {
  title: "CERTICOS BOOKS",
  description: "프론트 테스트 | 카카오 도서 검색 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full antialiased`}>
      <body className="text-primary flex min-h-full flex-col bg-white">
        <Providers>
          <GlobalHeader />
          <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
