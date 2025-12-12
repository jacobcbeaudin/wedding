'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { trpc } from '@/components/providers/trpc-provider';

type SortField = 'guest' | 'party' | 'event' | 'status' | 'meal' | 'updated';
type SortDirection = 'asc' | 'desc';

export function RsvpsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined' | 'pending'>(
    'all'
  );
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('updated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { data: rsvps, isLoading } = trpc.admin.listRsvps.useQuery();
  const { data: events } = trpc.admin.listEvents.useQuery();

  const downloadCSV = () => {
    if (!rsvps) return;

    const headers = [
      'Guest',
      'Party',
      'Event',
      'Status',
      'Meal Choice',
      'Dietary Restrictions',
      'Updated At',
    ];
    const rows = rsvps.map((rsvp) => [
      `${rsvp.guest.firstName} ${rsvp.guest.lastName}`,
      rsvp.guest.party.name,
      rsvp.event.name,
      rsvp.status,
      rsvp.mealChoice || '',
      rsvp.guest.dietaryRestrictions || '',
      new Date(rsvp.updatedAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'attending':
        return <Badge variant="default">Attending</Badge>;
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  // Group RSVPs by event for summary
  const rsvpsByEvent = events?.map((event) => {
    const eventRsvps = rsvps?.filter((r) => r.event.id === event.id) || [];
    return {
      event,
      attending: eventRsvps.filter((r) => r.status === 'attending').length,
      declined: eventRsvps.filter((r) => r.status === 'declined').length,
      pending: eventRsvps.filter((r) => r.status === 'pending').length,
    };
  });

  // Filter and sort RSVPs
  const filteredAndSortedRsvps = useMemo(() => {
    if (!rsvps) return [];

    const result = rsvps.filter((rsvp) => {
      const matchesSearch =
        searchQuery === '' ||
        `${rsvp.guest.firstName} ${rsvp.guest.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        rsvp.guest.party.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || rsvp.status === statusFilter;
      const matchesEvent = eventFilter === 'all' || rsvp.event.id === eventFilter;

      return matchesSearch && matchesStatus && matchesEvent;
    });

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'guest':
          comparison = `${a.guest.firstName} ${a.guest.lastName}`.localeCompare(
            `${b.guest.firstName} ${b.guest.lastName}`
          );
          break;
        case 'party':
          comparison = a.guest.party.name.localeCompare(b.guest.party.name);
          break;
        case 'event':
          comparison = a.event.name.localeCompare(b.event.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'meal':
          comparison = (a.mealChoice || '').localeCompare(b.mealChoice || '');
          break;
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [rsvps, searchQuery, statusFilter, eventFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="hover:bg-muted/50 cursor-pointer select-none"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-xs">{sortDirection === 'asc' ? '▲' : '▼'}</span>
        )}
      </span>
    </TableHead>
  );

  if (isLoading) {
    return <div className="text-muted-foreground py-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary by event */}
      <div className="grid gap-4 md:grid-cols-3">
        {rsvpsByEvent?.map(({ event, attending, declined, pending }) => (
          <Card key={event.id} className="p-4">
            <h3 className="font-semibold">{event.name}</h3>
            <div className="mt-2 flex gap-2 text-sm">
              <span className="text-green-600">{attending} attending</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-red-600">{declined} declined</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-yellow-600">{pending} pending</span>
            </div>
          </Card>
        ))}
      </div>

      {/* RSVP table */}
      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">
            RSVPs ({filteredAndSortedRsvps.length}
            {filteredAndSortedRsvps.length !== rsvps?.length && ` of ${rsvps?.length}`})
          </h2>
          <div className="flex flex-1 flex-wrap gap-2 sm:max-w-2xl">
            <Input
              placeholder="Search guest or party..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="bg-background rounded-md border px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="attending">Attending</option>
              <option value="declined">Declined</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="bg-background rounded-md border px-3 py-2 text-sm"
            >
              <option value="all">All Events</option>
              {events?.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
            <Button size="sm" variant="outline" onClick={downloadCSV}>
              Export CSV
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="guest">Guest</SortableHeader>
                <SortableHeader field="party">Party</SortableHeader>
                <SortableHeader field="event">Event</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
                <SortableHeader field="meal">Meal</SortableHeader>
                <TableHead>Dietary</TableHead>
                <SortableHeader field="updated">Updated</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedRsvps.map((rsvp) => (
                <TableRow key={rsvp.id}>
                  <TableCell className="font-medium">
                    {rsvp.guest.firstName} {rsvp.guest.lastName}
                  </TableCell>
                  <TableCell>{rsvp.guest.party.name}</TableCell>
                  <TableCell>{rsvp.event.name}</TableCell>
                  <TableCell>{getStatusBadge(rsvp.status)}</TableCell>
                  <TableCell>
                    {rsvp.mealChoice || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    {rsvp.guest.dietaryRestrictions || (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(rsvp.updatedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedRsvps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground py-8 text-center">
                    No RSVPs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
