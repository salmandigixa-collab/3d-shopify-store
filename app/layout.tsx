import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nova Atelier | 3D Shopify Experience',
  description: 'Immersive 3D storefront built with Next.js and Shopify-ready architecture.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
