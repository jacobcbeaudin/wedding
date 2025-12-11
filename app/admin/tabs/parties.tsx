'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Pencil, Trash2, Search, CheckCircle, Clock } from 'lucide-react';

interface PartiesTabProps {
  adminToken: string;
}

export function PartiesTab({ adminToken }: PartiesTabProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'responded' | 'pending'>('all');
  const [editingParty, setEditingParty] = useState<{
    id: string;
    name: string;
    email: string;
    notes: string | null;
  } | null>(null);

  const utils = trpc.useUtils();
  const { data: parties, isLoading } = trpc.admin.listParties.useQuery({ adminToken });
  const { data: allEvents } = trpc.admin.listEvents.useQuery({ adminToken });

  const createMutation = trpc.admin.createParty.useMutation({
    onSuccess: () => {
      utils.admin.listParties.invalidate();
      utils.admin.getDashboardStats.invalidate();
      setIsAddOpen(false);
    },
  });

  const updateMutation = trpc.admin.updateParty.useMutation({
    onSuccess: () => {
      utils.admin.listParties.invalidate();
      setEditingParty(null);
    },
  });

  const deleteMutation = trpc.admin.deleteParty.useMutation({
    onSuccess: () => {
      utils.admin.listParties.invalidate();
      utils.admin.getDashboardStats.invalidate();
    },
  });

  const bulkInviteMutation = trpc.admin.bulkInvite.useMutation({
    onSuccess: () => {
      utils.admin.listParties.invalidate();
      utils.admin.listInvitations.invalidate();
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    createMutation.mutate({
      adminToken,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      notes: (formData.get('notes') as string) || null,
    });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingParty) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    updateMutation.mutate({
      adminToken,
      id: editingParty.id,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      notes: (formData.get('notes') as string) || null,
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete party "${name}"? This will also delete all guests in this party.`)) {
      deleteMutation.mutate({ adminToken, id });
    }
  };

  const handleInviteToggle = (
    partyId: string,
    currentInvitations: { event: { id: string } }[],
    eventId: string
  ) => {
    const currentEventIds = currentInvitations.map((inv) => inv.event.id);
    const isInvited = currentEventIds.includes(eventId);
    const newEventIds = isInvited
      ? currentEventIds.filter((id) => id !== eventId)
      : [...currentEventIds, eventId];

    bulkInviteMutation.mutate({
      adminToken,
      partyId,
      eventIds: newEventIds,
    });
  };

  // Filter parties based on search query and status
  const filteredParties = parties?.filter((party) => {
    const matchesSearch =
      searchQuery === '' ||
      party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      party.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      party.guests.some(
        (g) =>
          g.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.lastName.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'responded' && party.submittedAt) ||
      (statusFilter === 'pending' && !party.submittedAt);

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Card className="border-0 p-8 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">
          Parties ({filteredParties?.length || 0}
          {filteredParties?.length !== parties?.length && ` of ${parties?.length}`})
        </h2>
        <div className="flex flex-1 gap-2 sm:max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or guest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'responded' | 'pending')}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="responded">Responded</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Party
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Party</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">Party Name</Label>
                <Input id="name" name="name" required placeholder="e.g., The Smith Family" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea id="notes" name="notes" placeholder="Any notes about this party..." />
              </div>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Party'}
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
              <TableHead>Email</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Invited To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParties?.map((party) => (
              <TableRow key={party.id}>
                <TableCell className="font-medium">{party.name}</TableCell>
                <TableCell>{party.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {party.guests.map((guest) => (
                      <Badge key={guest.id} variant="secondary" className="text-xs">
                        {guest.firstName} {guest.lastName}
                        {guest.isPrimary && ' *'}
                      </Badge>
                    ))}
                    {party.guests.length === 0 && (
                      <span className="text-muted-foreground">No guests</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {allEvents?.map((event) => {
                      const isInvited = party.invitations.some((inv) => inv.event.id === event.id);
                      return (
                        <Badge
                          key={event.id}
                          variant={isInvited ? 'default' : 'outline'}
                          className="cursor-pointer text-xs"
                          onClick={() => handleInviteToggle(party.id, party.invitations, event.id)}
                        >
                          {event.name}
                        </Badge>
                      );
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  {party.submittedAt ? (
                    <Badge variant="default" className="gap-1 bg-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Responded
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setEditingParty({
                          id: party.id,
                          name: party.name,
                          email: party.email,
                          notes: party.notes,
                        })
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(party.id, party.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingParty} onOpenChange={() => setEditingParty(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Party</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Party Name</Label>
              <Input id="edit-name" name="name" required defaultValue={editingParty?.name} />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                required
                defaultValue={editingParty?.email}
              />
            </div>
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea id="edit-notes" name="notes" defaultValue={editingParty?.notes || ''} />
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
