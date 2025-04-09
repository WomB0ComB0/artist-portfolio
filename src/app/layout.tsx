import { Semantics } from '@/components';
import { app } from '@/constants';
import { Providers } from '@/providers';
import { constructMetadata, constructViewport } from '@/utils';
import type { NextWebVitalsMetric } from 'next/app';
import '@/style/globals.css';
import Scripts from '@/scripts/scripts';

export const metadata = constructMetadata();
export const viewport = constructViewport();
export const reportWebVitals = (metric: NextWebVitalsMetric) => {
  if (metric.label === 'web-vital') {
    console.log(metric);
  }
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <Scripts />
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Semantics>
            <main className="flex-grow">
              {/* Google Tag Manager (noscript) */}
              <noscript>
                <iframe
                  src="https://www.googletagmanager.com/ns.html?id=GTM-WQJS4MZL"
                  height="0"
                  width="0"
                  style={{ display: 'none', visibility: 'hidden' }}
                />
              </noscript>
              {/* End Google Tag Manager (noscript) */}
              {children}
              {modal}
            </main>
            <footer className="py-4 px-6 dark:bg-gray-800 text-center text-sm text-gray-600 dark:text-gray-400 w-fit h-fit mx-auto">
              <p>
                © {currentYear} {app.name}. All Rights Reserved.
              </p>
              <p className="mt-2">
                <a
                  href={`mailto:${app.email}`}
                  className="hover:underline transition-colors duration-200"
                >
                  {app.email}
                </a>
              </p>
            </footer>
          </Semantics>
        </Providers>
      </body>
    </html>
  );
}
