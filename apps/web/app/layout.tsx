import type { Metadata } from 'next';
import { Providers } from './providers';
import { ToastContainer } from 'react-toastify/unstyled';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'Home Assignment',
  description: 'Interview home assignment for Qualif-ID',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={'antialiased'}>
        <Providers>{children}</Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
