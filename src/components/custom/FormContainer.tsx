'use client';
import type React from 'react';

export const FormContainer: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  return <div>{children}</div>;
};
