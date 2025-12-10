'use client';

import { useState } from 'react';
import CoastalLayout from '@/components/CoastalLayout';
import SectionDivider from '@/components/SectionDivider';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const photos = [
  { src: '/images/photo-01.webp', alt: 'Photo 1' },
  { src: '/images/photo-02.webp', alt: 'Photo 2' },
  { src: '/images/photo-03.webp', alt: 'Photo 3' },
  { src: '/images/photo-04.webp', alt: 'Photo 4' },
  { src: '/images/photo-05.webp', alt: 'Photo 5' },
];

export default function Photos() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  return (
    <CoastalLayout>
      <div className="container mx-auto max-w-6xl px-6 py-12 sm:py-20">
        <div className="mb-12 text-center sm:mb-16">
          <h1 className="elegant-serif mb-6 text-4xl font-light text-foreground sm:text-5xl md:text-6xl">
            Our Gallery
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Moments we&apos;ve shared together
          </p>
        </div>

        <SectionDivider />

        <div className="mb-12 grid grid-cols-1 gap-4 sm:mb-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="coastal-shadow hover-elevate group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setSelectedPhoto(index)}
              data-testid={`photo-${index}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-80"
              />
            </div>
          ))}
        </div>

        <Dialog open={selectedPhoto !== null} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl border-none bg-transparent p-0">
            {selectedPhoto !== null && (
              <img
                src={photos[selectedPhoto].src}
                alt={photos[selectedPhoto].alt}
                className="h-auto w-full rounded-lg"
              />
            )}
          </DialogContent>
        </Dialog>

        <div className="text-center">
          <p className="elegant-serif mb-2 text-xl text-foreground sm:text-2xl">
            More memories to come
          </p>
          <p className="text-sm text-muted-foreground sm:text-base">
            Check back after the wedding for photos from our celebration
          </p>
        </div>
      </div>
    </CoastalLayout>
  );
}
