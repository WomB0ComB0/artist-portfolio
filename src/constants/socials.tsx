'use client';
import { InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import React from 'react';

export const Socials_: {
  icon: React.JSX.Element;
  alt: string;
  href: string;
}[] = [
  {
    icon: <TwitterLogoIcon width={24} height={24} />,
    alt: 'Twitter',
    href: 'https://twitter.com/<twitter-username>',
  },
  {
    icon: <InstagramLogoIcon width={24} height={24} />,
    alt: 'Instagram',
    href: 'https://www.instagram.com/<instagram-username>',
  },
  {
    icon: <LinkedInLogoIcon width={24} height={24} />,
    alt: 'LinkedIn',
    href: 'https://www.linkedin.com/in/<linkedin-username>',
  },
];

export const Socials = React.memo(() => {
  return (
    <div className="flex space-x-4">
      {Socials_.map((Icon) => (
        <Link
          href={Icon.href}
          key={Icon.alt}
          rel="noopener noreferrer"
          target="_blank"
          aria-label={Icon.alt}
          className={'text-gray-400 hover:text-gray-600'}
        >
          {Icon.icon}
        </Link>
      ))}
    </div>
  );
});
