'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MAX_SONG_REQUESTS } from '@/lib/config/rsvp';

interface SongRequest {
  song: string;
  artist: string;
}

interface SongRequestsSectionProps {
  songRequests: SongRequest[];
  onSongChange: (index: number, field: 'song' | 'artist', value: string) => void;
  onAddSong: () => void;
  onRemoveSong: (index: number) => void;
}

export function SongRequestsSection({
  songRequests,
  onSongChange,
  onAddSong,
  onRemoveSong,
}: SongRequestsSectionProps) {
  return (
    <Card className="coastal-shadow mb-6 border-0 p-6 sm:mb-8 sm:p-8">
      <h3 className="text-foreground mb-6 text-lg font-medium sm:text-xl">Song Requests</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        Any songs you&apos;d love to hear at the reception? (Max {MAX_SONG_REQUESTS})
      </p>
      <div className="space-y-4">
        {songRequests.map((sr, index) => (
          <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
            <div className="flex-1">
              <Label htmlFor={`song-${index}`} className="text-muted-foreground mb-1 block text-xs">
                Song
              </Label>
              <Input
                id={`song-${index}`}
                placeholder="Song name..."
                value={sr.song}
                onChange={(e) => onSongChange(index, 'song', e.target.value)}
                data-testid={`input-song-${index}`}
              />
            </div>
            <div className="flex-1">
              <Label
                htmlFor={`artist-${index}`}
                className="text-muted-foreground mb-1 block text-xs"
              >
                Artist (optional)
              </Label>
              <Input
                id={`artist-${index}`}
                placeholder="Artist name..."
                value={sr.artist}
                onChange={(e) => onSongChange(index, 'artist', e.target.value)}
                data-testid={`input-artist-${index}`}
              />
            </div>
            {songRequests.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveSong(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        {songRequests.length < MAX_SONG_REQUESTS && (
          <Button type="button" variant="outline" size="sm" onClick={onAddSong} className="mt-2">
            + Add Another Song
          </Button>
        )}
      </div>
    </Card>
  );
}
