'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Socials_ } from '@/constants';
import { Home, MailIcon, Menu, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CustomPicture as Picture } from '@/components/custom';
import React, { useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';

const routes: { name: string; icon: React.ElementType; href: string }[] = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'About', icon: User, href: '/about' },
  { name: 'Contact', icon: MailIcon, href: 'mailto:email@example.com' },
];

const SidebarContent = React.memo(() => (
  <div className="flex flex-col h-full">
    <div className="p-0">
      <Link href={'/'} rel={'noopener noreferrer'} target={'_self'}>
        <Picture>
          <Image
            src="/assets/images/logo.png"
            width={100}
            height={100}
            alt="logo"
            className="rounded-full"
            priority
          />
        </Picture>
      </Link>
    </div>
    <nav className="px-0 py-4 space-y-2">
      {routes.map((route) => (
        <Link
          key={route.name}
          href={route.href}
          className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <route.icon className="w-5 h-5 mr-3" />
          {route.name}
        </Link>
      ))}
    </nav>
    <div className="p-4 flex justify-start space-x-4 mb-12">
      {Socials_.map((social) => (
        <Link
          key={social.alt}
          href={social.href}
          className="text-gray-400 hover:text-gray-600"
          target={'_blank'}
          rel="noopener noreferrer"
        >
          {social.icon}
        </Link>
      ))}
    </div>
  </div>
));

SidebarContent.displayName = 'SidebarContent';

export const Sidebar = React.memo(() => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const MemoizedSidebarContent = useMemo(() => <SidebarContent />, []);

  if (!isMobile) {
    return <aside className="w-64 h-screen bg-white shadow-md">{MemoizedSidebarContent}</aside>;
  }

  return (
    <header className="h-16 flex items-center justify-between px-4 bg-white shadow-md md:hidden">
      <Link href={'/'} rel={'noopener noreferrer'} target={'_self'}>
        <Picture>
          <Image
            src="/assets/images/logo.png"
            width={40}
            height={40}
            alt="logo"
            className="rounded-full"
          />
        </Picture>
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          {MemoizedSidebarContent}
        </SheetContent>
      </Sheet>
    </header>
  );
});

Sidebar.displayName = 'Sidebar';
