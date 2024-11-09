import type { Metadata } from 'next';
import './globals.css';
import './ChatbotBackgroundImage.css';
import HeaderSelector from '@/components/HeaderSelector';
import { Web3AuthProvider } from '@/context/Web3AuthContext';

export const metadata: Metadata = {
  title: 'Budy',
  description: 'Tu amigo inteligente de confianza.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="ChatbotBackgroundImage">
        <Web3AuthProvider>
          <HeaderSelector />
          {children}
        </Web3AuthProvider>
      </body>
    </html>
  );
}
