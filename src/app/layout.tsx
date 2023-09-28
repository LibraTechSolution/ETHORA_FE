import '@/app/globals.scss';
import '@rainbow-me/rainbowkit/styles.css';

import { Providers } from '@/providers';

import { Global } from './components/Global';

export const metadata = {
  title: 'Base',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Global />
          {children}
        </Providers>
      </body>
    </html>
  );
}
