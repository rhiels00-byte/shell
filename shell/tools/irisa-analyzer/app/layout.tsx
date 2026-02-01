import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '이리사 - 종합 분석기',
  description: '교사를 위한 수업 산출물 종합 분석 도구',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
