import React, { useState } from 'react';
import { Project, UserRole, User } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { AddMemberModal } from './AddMemberModal';
import { UserPlus, UserX, Crown, Shield, Mail } from 'lucide-react';
import { getInitials } from '../../utils/format';

interface MembersPanelProps {
  project: Project;
  onAddMember: (email: string) => void;
  onRemoveMember: (email: string) => void;
  isAddingMember: boolean;
  isRemovingMember: boolean;
}

export const MembersPanel: React.FC<MembersPanelProps> = ({
  project,
  onAddMember,
  onRemoveMember,
  isAddingMember,
  isRemovingMember,
}) => {
  const currentUser = useAuthStore((state) => state.user);
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<User | null>(null);

  const ownerId = typeof project.owner === 'object' ? project.owner._id : project.owner;
  const ownerEmail = typeof project.owner === 'object' ? project.owner.email : '';

  const isCurrentOwner = currentUser?._id === ownerId || (ownerEmail !== '' && currentUser?.email === ownerEmail);
  const canManageMembers = isCurrentOwner || currentUser?.role === UserRole.ADMIN;

  const memberEmails = (project.members || []).map((m) => m.email);

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      onRemoveMember(memberToRemove.email);
      setMemberToRemove(null);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Project Members</span>
            <Badge variant="default" size="sm">
              {project.members ? project.members.length : 0}
            </Badge>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Team members with access to this project
          </p>
        </div>

        {/* Owner or Admin action */}
        {canManageMembers && (
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add Member
          </Button>
        )}
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {project.members && project.members.map((member) => {
          const isMemberOwner = member._id === ownerId || member.email === ownerEmail;

          return (
            <div
              key={member._id}
              className="flex items-center justify-between py-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm">
                  {getInitials(member.fullName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {member.fullName}
                    </span>
                    {isMemberOwner && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/60">
                        <Crown className="w-3 h-3" /> Owner
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {member.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant={member.role === UserRole.ADMIN ? 'purple' : 'info'}
                  size="sm"
                >
                  {member.role}
                </Badge>

                {/* Owner or Admin remove action (cannot remove owner) */}
                {canManageMembers && !isMemberOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 h-auto"
                    onClick={() => setMemberToRemove(member)}
                    title="Remove member"
                  >
                    <UserX className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {canManageMembers && (
        <AddMemberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddMember={onAddMember}
          isLoading={isAddingMember}
          existingMemberEmails={memberEmails}
        />
      )}

      {/* Remove Confirmation Dialog */}
      {memberToRemove && (
        <ConfirmDialog
          isOpen={!!memberToRemove}
          onClose={() => setMemberToRemove(null)}
          onConfirm={handleConfirmRemove}
          title="Remove Project Member"
          message={`Are you sure you want to remove ${memberToRemove.fullName} (${memberToRemove.email}) from this project?`}
          confirmText="Remove Member"
          isLoading={isRemovingMember}
        />
      )}
    </div>
  );
};
