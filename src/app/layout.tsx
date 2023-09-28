import '@/app/globals.scss';
import { Global } from '@/components/Global';

import { Providers } from '@/providers';
// import { Poppins } from 'next/font/google';

// const poppins  = Poppins({
//   weight: ['100','200','300','400','500','600','700','800','900'],
//   style: ['normal', 'italic'],
//   subsets: ["latin"],
// });

export const metadata = {
  title: 'Base',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* <body className={`${poppins.className}`}> */}
        <body>
        <Providers>
          <Global />
          {children}
        </Providers>
      </body>
    </html>
  );
}
