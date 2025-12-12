'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { trpc } from '@/components/providers/trpc-provider';
import { generateCSV, downloadCSV, csvFilename } from '@/lib/utils/csv';

export function SongsTab() {
  const utils = trpc.useUtils();
  const { data: songs, isLoading } = trpc.admin.listSongRequests.useQuery();

  const deleteMutation = trpc.admin.deleteSongRequest.useMutation({
    onSuccess: () => {
      utils.admin.listSongRequests.invalidate();
      utils.admin.getDashboardStats.invalidate();
    },
  });

  const handleDelete = (id: string, song: string) => {
    if (confirm(`Remove "${song}" from requests?`)) {
      deleteMutation.mutate({ id });
    }
  };

  const handleExportCSV = () => {
    if (!songs) return;

    const headers = ['Song', 'Artist', 'Requested By', 'Requested At'];
    const rows = songs.map((song) => [
      song.song,
      song.artist || '',
      song.party.name,
      new Date(song.createdAt).toLocaleDateString(),
    ]);

    const csv = generateCSV(headers, rows);
    downloadCSV(csvFilename('song-requests'), csv);
  };

  if (isLoading) {
    return <div className="text-muted-foreground py-8 text-center">Loading...</div>;
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Song Requests ({songs?.length || 0})</h2>
        <Button size="sm" variant="outline" onClick={handleExportCSV} disabled={!songs?.length}>
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Song</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {songs?.map((song) => (
              <TableRow key={song.id}>
                <TableCell className="font-medium">{song.song}</TableCell>
                <TableCell>
                  {song.artist || <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell>{song.party.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(song.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(song.id, song.song)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {songs?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                  No song requests yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
