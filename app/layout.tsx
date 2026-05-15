import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'SatuLangkah - Teman Beres-Beres Tanpa Tekanan',
  description: 'AI yang membantu mengubah rasa kewalahan menjadi langkah-langkah kecil yang lebih mudah dijalani.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
