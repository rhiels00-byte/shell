import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Teacher Platform - AI 교육 도구',
  description: 'AI 기반 교육 도구 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
