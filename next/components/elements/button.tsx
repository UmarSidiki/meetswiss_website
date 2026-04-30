import { LinkProps } from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'simple' | 'outline' | 'primary' | 'muted';
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  href?: LinkProps['href'];
  onClick?: () => void;
  [key: string]: any;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  as: Tag = 'button',
  className,
  children,
  ...props
}) => {
  const variantClass =
    variant === 'simple'
      ? 'relative z-10 border border-primary/35 bg-transparent text-white text-sm transition font-medium duration-200 rounded-md px-4 py-2 flex items-center justify-center hover:border-primary hover:bg-primary/10 hover:text-primary'
      : variant === 'outline'
        ? 'bg-charcoal relative z-10 text-primary border border-primary/60 text-sm transition font-medium duration-200 rounded-md px-4 py-2 flex items-center justify-center hover:bg-primary hover:text-black'
        : variant === 'primary'
          ? 'bg-primary relative z-10 border border-primary text-black text-sm transition font-medium duration-200 rounded-md px-4 py-2 flex items-center justify-center shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_4px_14px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0'
          : variant === 'muted'
            ? 'bg-[#111] relative z-10 border border-amber-400/20 text-[#c8bfa8] text-sm transition font-medium duration-200 rounded-md px-4 py-2 flex items-center justify-center hover:bg-[#1a1a1a] hover:border-amber-400/40 hover:text-amber-400'
            : '';
  const Element = Tag as any;

  return (
    <Element
      className={cn(
        'relative z-10 border border-transparent text-white text-sm transition font-medium duration-200 rounded-md px-4 py-2 flex items-center justify-center',
        variantClass,
        className
      )}
      {...props}
      suppressHydrationWarning
    >
      {children ?? `Get Started`}
    </Element>
  );
};
