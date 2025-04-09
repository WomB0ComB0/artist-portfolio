'use client';

import Script from 'next/script';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

export default function Scripts() {
  useIsomorphicLayoutEffect(() => {
    document.addEventListener('contextmenu', (event: MouseEvent) => {
      event.preventDefault();
    });
  }, []);

  return (
    <>
      <head>
        <>
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id= G-35XF0F112X"
          />
          <Script
            strategy="afterInteractive"
            id="google-analytics"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', ' G-35XF0F112X');
          `,
            }}
          />
          <Script
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WQJS4MZL');
          `,
            }}
          />
        </>
      </head>
    </>
  );
}
