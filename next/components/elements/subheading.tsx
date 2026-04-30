import { MotionProps } from 'framer-motion';
import React from 'react';
import Balancer from 'react-wrap-balancer';

import { cn } from '@/lib/utils';

export const Subheading = ({
  className,
  as: Tag = 'h2',
  children,
  ...props
}: {
  className?: string;
  as?: any;
  children: any;
  props?: React.HTMLAttributes<HTMLHeadingElement>;
} & MotionProps &
  React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <Tag
      className={cn(
        'max-w-4xl text-left my-4 mx-auto text-center font-normal',
        'text-sm md:text-base leading-[1.75] text-[#c8bfa8]',
        className
      )}
    >
      <Balancer>{children}</Balancer>
    </Tag>
  );
};
