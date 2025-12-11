'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { trpc } from '@/components/providers/trpc-provider';

interface GuestsTabProps {
  adminToken: string;
}

export function GuestsTab({ adminToken }: GuestsTabProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingGuest, setEditingGuest] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    isPrimary: boolean;
    isChild: boolean;
    dietaryRestrictions: string | null;
  } | null>(null);
  const [newGuestPartyId, setNewGuestPartyId] = useState<string>('');

  const utils = trpc.useUtils();
  const { data: guests, isLoading } = trpc.admin.listGuests.useQuery({ adminToken });
  const { data: parties } = trpc.admin.listParties.useQuery({ adminToken });

  const createMutation = trpc.admin.createGuest.useMutation({
    onSuccess: () => {
      utils.admin.listGuests.invalidate();
      utils.admin.listParties.invalidate();
      utils.admin.getDashboardStats.invalidate();
      setIsAddOpen(false);
      setNewGuestPartyId('');
    },
  });

  const updateMutation = trpc.admin.updateGuest.useMutation({
    onSuccess: () => {
      utils.admin.listGuests.invalidate();
      utils.admin.listParties.invalidate();
      setEditingGuest(null);
    },
  });

  const deleteMutation = trpc.admin.deleteGuest.useMutation({
    onSuccess: () => {
      utils.admin.listGuests.invalidate();
      utils.admin.listParties.invalidate();
      utils.admin.getDashboardStats.invalidate();
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    createMutation.mutate({
      adminToken,
      partyId: newGuestPartyId,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      isPrimary: formData.get('isPrimary') === 'on',
      isChild: formData.get('isChild') === 'on',
      dietaryRestrictions: (formData.get('dietaryRestrictions') as string) || null,
    });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingGuest) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    updateMutation.mutate({
      adminToken,
      id: editingGuest.id,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      isPrimary: formData.get('isPrimary') === 'on',
      isChild: formData.get('isChild') === 'on',
      dietaryRestrictions: (formData.get('dietaryRestrictions') as string) || null,
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete guest "${name}"?`)) {
      deleteMutation.mutate({ adminToken, id });
    }
  };

  // Filter guests based on search query
  const filteredGuests = guests?.filter((guest) => {
    if (searchQuery === '') return true;
    const query = searchQuery.toLowerCase();
    return (
      guest.firstName.toLowerCase().includes(query) ||
      guest.lastName.toLowerCase().includes(query) ||
      guest.party.name.toLowerCase().includes(query) ||
      guest.dietaryRestrictions?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">
          Guests ({filteredGuests?.length || 0}
          {filteredGuests?.length !== guests?.length && ` of ${guests?.length}`})
        </h2>
        <div className="flex flex-1 gap-2 sm:max-w-md">
          <Input
            placeholder="Search by name, party, or dietary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">Add Guest</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Guest</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="partyId">Party</Label>
                <Select value={newGuestPartyId} onValueChange={setNewGuestPartyId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a party" />
                  </SelectTrigger>
                  <SelectContent>
                    {parties?.map((party) => (
                      <SelectItem key={party.id} value={party.id}>
                        {party.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="isPrimary" name="isPrimary" />
                  <Label htmlFor="isPrimary">Primary Contact</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="isChild" name="isChild" />
                  <Label htmlFor="isChild">Child</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                <Input id="dietaryRestrictions" name="dietaryRestrictions" />
              </div>
              <Button type="submit" disabled={createMutation.isPending || !newGuestPartyId}>
                {createMutation.isPending ? 'Creating...' : 'Create Guest'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dietary</TableHead>
              <TableHead>RSVPs</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuests?.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell className="font-medium">
                  {guest.firstName} {guest.lastName}
                  {guest.isPrimary && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Primary
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{guest.party.name}</TableCell>
                <TableCell>
                  {guest.isChild ? (
                    <Badge variant="secondary">Child</Badge>
                  ) : (
                    <Badge variant="outline">Adult</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {guest.dietaryRestrictions || <span className="text-muted-foreground">None</span>}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {guest.rsvps.map((rsvp) => (
                      <Badge
                        key={rsvp.id}
                        variant={
                          rsvp.status === 'attending'
                            ? 'default'
                            : rsvp.status === 'declined'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className="text-xs"
                      >
                        {rsvp.event.name}: {rsvp.status}
                      </Badge>
                    ))}
                    {guest.rsvps.length === 0 && (
                      <span className="text-muted-foreground">No RSVPs</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEditingGuest({
                          id: guest.id,
                          firstName: guest.firstName,
                          lastName: guest.lastName,
                          isPrimary: guest.isPrimary,
                          isChild: guest.isChild,
                          dietaryRestrictions: guest.dietaryRestrictions,
                        })
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(guest.id, `${guest.firstName} ${guest.lastName}`)}
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
      <Dialog open={!!editingGuest} onOpenChange={() => setEditingGuest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Guest</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  name="firstName"
                  required
                  defaultValue={editingGuest?.firstName}
                />
              </div>
              <div>
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  name="lastName"
                  required
                  defaultValue={editingGuest?.lastName}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="edit-isPrimary"
                  name="isPrimary"
                  defaultChecked={editingGuest?.isPrimary}
                />
                <Label htmlFor="edit-isPrimary">Primary Contact</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="edit-isChild" name="isChild" defaultChecked={editingGuest?.isChild} />
                <Label htmlFor="edit-isChild">Child</Label>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-dietaryRestrictions">Dietary Restrictions</Label>
              <Input
                id="edit-dietaryRestrictions"
                name="dietaryRestrictions"
                defaultValue={editingGuest?.dietaryRestrictions || ''}
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
