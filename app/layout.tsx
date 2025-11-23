import type { Metadata } from 'next';
import { Oxanium, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const oxanium = Oxanium({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-oxanium',
  display: 'swap',
  preload: true,
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-source-code-pro',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Abe's AI Usage Dashboard",
  description: 'Monitor and track Google Cloud AI and Supabase usage',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${oxanium.variable} ${sourceCodePro.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
