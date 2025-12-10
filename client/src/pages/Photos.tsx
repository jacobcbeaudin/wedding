import { useState } from 'react';
import SectionDivider from '@/components/SectionDivider';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import photo1 from '@assets/photo-01.webp';
import photo2 from '@assets/photo-02.webp';
import photo3 from '@assets/photo-03.webp';
import photo4 from '@assets/photo-04.webp';
import photo5 from '@assets/photo-05.webp';

const photos = [
  { src: photo1, alt: 'Photo 1' },
  { src: photo2, alt: 'Photo 2' },
  { src: photo3, alt: 'Photo 3' },
  { src: photo4, alt: 'Photo 4' },
  { src: photo5, alt: 'Photo 5' },
];

export default function Photos() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  return (
    <div className="container mx-auto max-w-6xl px-6 py-20">
      <div className="mb-16 text-center">
        <h1 className="elegant-serif mb-6 text-5xl font-light text-foreground md:text-6xl">
          Our Gallery
        </h1>
        <p className="text-lg text-muted-foreground">Moments we've shared together</p>
      </div>

      <SectionDivider />

      <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              className="h-80 w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
        <p className="elegant-serif mb-2 text-2xl text-foreground">More memories to come</p>
        <p className="text-muted-foreground">
          Check back after the wedding for photos from our celebration
        </p>
      </div>
    </div>
  );
}
