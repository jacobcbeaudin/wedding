'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function RsvpFormSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Party Welcome Card */}
      <Card className="coastal-shadow border-0 p-6 sm:p-8">
        <Skeleton className="mb-4 h-7 w-48" />
        <Skeleton className="mb-4 h-4 w-64" />
        <div className="mt-4 flex flex-wrap gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
        </div>
      </Card>

      {/* Events Card */}
      <Card className="coastal-shadow border-0 p-6 sm:p-8">
        <Skeleton className="mb-6 h-6 w-32" />

        <div className="space-y-6 sm:space-y-8">
          {/* Event 1 */}
          <div className="bg-muted/30 rounded-lg p-4 sm:p-6">
            <Skeleton className="mb-2 h-5 w-40" />
            <Skeleton className="mb-4 h-4 w-56" />

            {/* Guest RSVP buttons */}
            <div className="space-y-3">
              <div className="bg-background/50 rounded-lg p-4">
                <Skeleton className="mb-3 h-4 w-32" />
                <div className="flex gap-3">
                  <Skeleton className="h-12 flex-1 rounded-lg" />
                  <Skeleton className="h-12 flex-1 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Event 2 */}
          <div className="bg-muted/30 rounded-lg p-4 sm:p-6">
            <Skeleton className="mb-2 h-5 w-48" />
            <Skeleton className="mb-4 h-4 w-56" />

            <div className="space-y-3">
              <div className="bg-background/50 rounded-lg p-4">
                <Skeleton className="mb-3 h-4 w-32" />
                <div className="flex gap-3">
                  <Skeleton className="h-12 flex-1 rounded-lg" />
                  <Skeleton className="h-12 flex-1 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Dietary Card */}
      <Card className="coastal-shadow border-0 p-6 sm:p-8">
        <Skeleton className="mb-6 h-6 w-44" />
        <div className="space-y-4">
          <div>
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </Card>

      {/* Song Requests Card */}
      <Card className="coastal-shadow border-0 p-6 sm:p-8">
        <Skeleton className="mb-4 h-6 w-36" />
        <Skeleton className="mb-4 h-4 w-64" />
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </Card>

      {/* Notes Card */}
      <Card className="coastal-shadow border-0 p-6 sm:p-8">
        <Skeleton className="mb-6 h-6 w-48" />
        <Skeleton className="h-24 w-full" />
      </Card>

      {/* Buttons */}
      <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
        <Skeleton className="h-10 w-full sm:w-28" />
        <Skeleton className="h-10 w-full sm:w-32" />
      </div>
    </div>
  );
}
