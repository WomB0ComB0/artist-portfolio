'use client';
import { Slide } from '@/components/animation/Slide';
import { about } from '@/constants';
import React from 'react';

export default function About() {
  const LinkToTheseReferences = [
    {
      title: 'About',
      url: 'https://<domain>/about',
    },
  ];
  return (
    <article
      className={`
        prose lg:prose-lg xl:prose-xl
        mx-auto
        px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20
        py-8
      `}
    >
      {about.map((item: string, index: number | string) => (
        <Slide
          key={`${item} - ${index as string}`}
          delay={+index * 0.1}
          className={`
            mb-8
            last:mb-0
          `}
          children={item}
        />
      ))}
    </article>
  );
}
