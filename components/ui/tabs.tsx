'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

function TabsList({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg p-1',
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  ref?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:outline-hidden',
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
