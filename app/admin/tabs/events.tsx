'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { trpc } from '@/components/providers/trpc-provider';

interface EventsTabProps {
  adminToken: string;
}

export function EventsTab({ adminToken }: EventsTabProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<{
    id: string;
    slug: string;
    name: string;
    date: Date | null;
    location: string | null;
    description: string | null;
    displayOrder: number;
  } | null>(null);

  const utils = trpc.useUtils();
  const { data: events, isLoading } = trpc.admin.listEvents.useQuery({ adminToken });

  const createMutation = trpc.admin.createEvent.useMutation({
    onSuccess: () => {
      utils.admin.listEvents.invalidate();
      utils.admin.getDashboardStats.invalidate();
      setIsAddOpen(false);
    },
  });

  const updateMutation = trpc.admin.updateEvent.useMutation({
    onSuccess: () => {
      utils.admin.listEvents.invalidate();
      setEditingEvent(null);
    },
  });

  const deleteMutation = trpc.admin.deleteEvent.useMutation({
    onSuccess: () => {
      utils.admin.listEvents.invalidate();
      utils.admin.getDashboardStats.invalidate();
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    createMutation.mutate({
      adminToken,
      slug: formData.get('slug') as string,
      name: formData.get('name') as string,
      date: (formData.get('date') as string) || null,
      location: (formData.get('location') as string) || null,
      description: (formData.get('description') as string) || null,
      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
    });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvent) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    updateMutation.mutate({
      adminToken,
      id: editingEvent.id,
      slug: formData.get('slug') as string,
      name: formData.get('name') as string,
      date: (formData.get('date') as string) || null,
      location: (formData.get('location') as string) || null,
      description: (formData.get('description') as string) || null,
      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (
      confirm(
        `Delete event "${name}"? This will also delete all invitations and RSVPs for this event.`
      )
    ) {
      deleteMutation.mutate({ adminToken, id });
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Events ({events?.length || 0})</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Add Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Event Name</Label>
                  <Input id="name" name="name" required placeholder="e.g., Wedding Ceremony" />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" required placeholder="e.g., wedding" />
                </div>
              </div>
              <div>
                <Label htmlFor="date">Date & Time</Label>
                <Input id="date" name="date" type="datetime-local" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="Venue name and address" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Event details..." />
              </div>
              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input id="displayOrder" name="displayOrder" type="number" defaultValue="0" />
              </div>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Event'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events?.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.displayOrder}</TableCell>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell className="font-mono text-sm">{event.slug}</TableCell>
                <TableCell>{formatDate(event.date)}</TableCell>
                <TableCell>
                  {event.location || <span className="text-muted-foreground">TBD</span>}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEditingEvent({
                          id: event.id,
                          slug: event.slug,
                          name: event.name,
                          date: event.date,
                          location: event.location,
                          description: event.description,
                          displayOrder: event.displayOrder,
                        })
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(event.id, event.name)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Event Name</Label>
                <Input id="edit-name" name="name" required defaultValue={editingEvent?.name} />
              </div>
              <div>
                <Label htmlFor="edit-slug">Slug</Label>
                <Input id="edit-slug" name="slug" required defaultValue={editingEvent?.slug} />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-date">Date & Time</Label>
              <Input
                id="edit-date"
                name="date"
                type="datetime-local"
                defaultValue={formatDateForInput(editingEvent?.date || null)}
              />
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                name="location"
                defaultValue={editingEvent?.location || ''}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                defaultValue={editingEvent?.description || ''}
              />
            </div>
            <div>
              <Label htmlFor="edit-displayOrder">Display Order</Label>
              <Input
                id="edit-displayOrder"
                name="displayOrder"
                type="number"
                defaultValue={editingEvent?.displayOrder}
              />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
