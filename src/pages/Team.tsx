import { useMembers } from '@/hooks/useMembers';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Trash2, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { AppRole } from '@/types/database';

const roleColors = {
  admin: 'bg-primary/10 text-primary border-primary/20',
  account_manager: 'bg-accent/10 text-accent border-accent/20',
  viewer: 'bg-muted text-muted-foreground border-border',
};

export default function Team() {
  const { members, isLoading, updateMemberRole, removeMember } = useMembers();
  const { role, user } = useAuth();

  const isAdmin = role === 'admin';

  const getInitials = (name: string | null | undefined, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground">
            Manage team members and their roles
          </p>
        </div>
        {isAdmin && (
          <Button disabled>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Team members table */}
      {members.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-card">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No team members</h3>
          <p className="text-muted-foreground">
            Invite team members to collaborate
          </p>
        </div>
      ) : (
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                {isAdmin && <TableHead className="w-32">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member: any) => {
                const profile = member.profiles;
                const isCurrentUser = member.user_id === user?.id;

                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(profile?.full_name, profile?.email || '')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {profile?.full_name || profile?.email}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                            )}
                          </div>
                          {profile?.full_name && (
                            <div className="text-sm text-muted-foreground">{profile.email}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isAdmin && !isCurrentUser ? (
                        <Select
                          value={member.role}
                          onValueChange={(v) =>
                            updateMemberRole.mutate({ membershipId: member.id, newRole: v as AppRole })
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="account_manager">Account Manager</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant="outline"
                          className={cn(
                            'capitalize',
                            roleColors[member.role as keyof typeof roleColors]
                          )}
                        >
                          {member.role.replace('_', ' ')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(member.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        {!isCurrentUser && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {profile?.full_name || profile?.email} from the
                                  team? They will lose access to all organization data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeMember.mutate(member.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
