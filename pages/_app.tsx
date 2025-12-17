import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import '../styles/globals.css';

// Dynamically import ThemeProvider with SSR disabled
const ThemeProvider = dynamic(
  () => import('../contexts/ThemeContext').then((mod) => ({ default: mod.ThemeProvider })),
  { ssr: false }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

