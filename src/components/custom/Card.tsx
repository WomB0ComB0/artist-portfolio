import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import * as React from 'react';

type CardProps = React.ComponentPropsWithoutRef<'article'> & {
  variant?: 'primary' | 'secondary';
};

const Card = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, style, variant, ...props }: CardProps, ref) => (
    <article
      className={cn(CardVariants({ variant }), className)}
      ref={ref}
      style={style}
      {...props}
    />
  ),
);

const CardVariants = cva('bg-foreground-800 text-foreground-800', {
  variants: {
    variant: {
      primary: 'bg-foreground-800 text-foreground-800',
      secondary: 'bg-foreground-800 text-foreground-800',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

Card.displayName = 'Card';

export { Card };
