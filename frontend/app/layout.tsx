import './globals.css';
import { Noto_Sans } from 'next/font/google';

// Configure Noto Sans with the necessary subsets
const notoSans = Noto_Sans({
  subsets: ['latin', 'latin-ext', 'cyrillic'], // For multilingual support
  weight: ['400', '700'], // Adjust weights as needed
  display: 'swap', // Optimize font rendering
});

export const metadata = {
  title: "Linux Lock - Online tools designed to streamline your workflow",
  description: "Our collection of online tools help you accomplish more in less time. Linux Lock is one stop in today's fast-paced world where efficiency is key.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={notoSans.className}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
