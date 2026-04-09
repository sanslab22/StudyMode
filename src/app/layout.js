import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'study/<mode>',
  description: 'Study mode',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
