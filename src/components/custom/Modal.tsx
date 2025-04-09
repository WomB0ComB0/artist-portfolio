'use client';

import { fadeInAnimationVariants } from '@/components';
import { cn } from '@/lib';
import { motion } from 'framer-motion';
import { type Dispatch, type SetStateAction, useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

export const Modal = ({
  children,
  className,
  isOpen,
  onClose,
}: {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
}) => {
  const dialogRef = useRef<React.ElementRef<'dialog'>>(null) as React.MutableRefObject<
    React.ElementRef<'dialog'>
  >;

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dialogDimensions = dialogRef.current?.getBoundingClientRect();
      if (
        dialogDimensions &&
        (e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom)
      ) {
        onClose(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useIsomorphicLayoutEffect(() => {
    document.body.classList.toggle('no-scroll', isOpen);
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  return (
    <section
      className={`
				fixed inset-0 z-50 flex flex-col items-center justify-center
				backdrop:bg-black/80 backdrop:backdrop-blur-sm w-[100dvw] h-[100dvh]
			`}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.dialog
        ref={dialogRef}
        className={cn(
          `
					border-none fixed inset-0 z-50 rounded-lg
					focus:outline-none mx-auto
				`,
          className,
        )}
        variants={fadeInAnimationVariants}
      >
        {children}
      </motion.dialog>
    </section>
  );
};
