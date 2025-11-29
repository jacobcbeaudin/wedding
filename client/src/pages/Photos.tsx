import { useState } from "react";
import SectionDivider from "@/components/SectionDivider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import photo1 from "@assets/generated_images/couple_engagement_photo_1.png";
import photo2 from "@assets/generated_images/couple_sunset_beach_photo.png";
import photo3 from "@assets/generated_images/couple_portrait_closeup.png";
import photo4 from "@assets/generated_images/couple_picnic_date_photo.png";
import photo5 from "@assets/generated_images/couple_hiking_adventure_photo.png";

const photos = [
  { src: photo1, alt: "Engagement photo" },
  { src: photo2, alt: "Sunset beach" },
  { src: photo3, alt: "Portrait closeup" },
  { src: photo4, alt: "Picnic date" },
  { src: photo5, alt: "Hiking adventure" },
  { src: photo1, alt: "Another moment" },
];

export default function Photos() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  return (
    <div className="py-20 container mx-auto px-6 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="elegant-serif text-5xl md:text-6xl font-light mb-6 text-foreground">
          Our Gallery
        </h1>
        <p className="text-lg text-muted-foreground">Moments we've shared together</p>
      </div>

      <SectionDivider />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="group cursor-pointer overflow-hidden rounded-lg coastal-shadow hover-elevate"
            onClick={() => setSelectedPhoto(index)}
            data-testid={`photo-${index}`}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      <Dialog open={selectedPhoto !== null} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selectedPhoto !== null && (
            <img
              src={photos[selectedPhoto].src}
              alt={photos[selectedPhoto].alt}
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="text-center">
        <p className="elegant-serif text-2xl text-foreground mb-2">More memories to come</p>
        <p className="text-muted-foreground">
          Check back after the wedding for photos from our celebration
        </p>
      </div>
    </div>
  );
}
