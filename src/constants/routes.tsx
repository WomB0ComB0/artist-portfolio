import { Home, Mail, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
const Routes_: {
  route: Record<string, string>;
  icon?: React.JSX.Element;
}[] = [
    {
      route: {
        path: '/',
        label: 'Illustrations',
      },
      icon: <Home size={24} />,
    },

    {
      route: {
        path: '/about',
        label: 'About/Resume',
      },
      icon: <Users size={24} />,
    },
    {
      route: {
        path: 'mailto:email@example.com',
        label: 'Contact',
      },
      icon: <Mail size={24} />,
    },
  ];

export const Routes = React.memo(() =>
  Routes_.map((route) => (
    <Link
      key={route.route.path}
      className={`
				flex items-center gap-2
				text-lg font-semibold
		`}
      href={route.route.path}
      aria-label={route.route.label}
    >
      {route.icon}
      {route.route.label}
    </Link>
  )),
);
