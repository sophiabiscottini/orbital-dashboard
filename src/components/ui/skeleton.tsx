import * as React from 'react';
import { cn } from '@/src/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[var(--background-tertiary)]',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
