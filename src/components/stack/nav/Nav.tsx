'use client';

import { CustomPicture as Picture } from '@/components';
import { Routes, Socials } from '@/constants';
import { Home, Mail, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const Nav = React.memo(() => {
  return (
    <div className="hidden border-r bg-white dark:bg-gray-800 md:block w-60">
      <div className="flex h-full max-h-screen flex-col">
        <div className="">
          <nav className="flex flex-col items-start px-4 py-6 space-y-6">
            <Picture className="w-full flex justify-center mb-6">
              <Image
                src="/assets/images/logo.png"
                quality={100}
                width={80}
                height={80}
                alt="MV Logo"
                className="object-contain"
              />
            </Picture>
            <Link
              href="/"
              className="flex items-center space-x-3 text-gray-400 hover:text-gray-600"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center space-x-3 text-gray-400 hover:text-gray-600"
            >
              <User size={20} />
              <span>About</span>
            </Link>
            <Link
              href="mailto:email@example.com"
              className="flex items-center space-x-3 text-gray-400 hover:text-gray-600"
            >
              <Mail size={20} />
              <span>Contact</span>
            </Link>
          </nav>
        </div>
        <div className="px-4 py-6 mb-12">
          <Socials />
        </div>
      </div>
    </div>
  );
});

Nav.displayName = 'Nav';
