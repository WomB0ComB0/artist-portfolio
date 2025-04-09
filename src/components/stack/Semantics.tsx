'use client';

import type React from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { Nav, Sidebar } from '.';

export const Semantics = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {!isMobile && <Nav />}
      <div className="flex flex-col">
        {isMobile && <Sidebar />}
        <main
          className={`
            flex flex-1 flex-col
            gap-4 p-4 lg:gap-6
            lg:p-6 ${isMobile ? 'max-w-full' : 'max-w-[calc(100vw-280px)]'}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
