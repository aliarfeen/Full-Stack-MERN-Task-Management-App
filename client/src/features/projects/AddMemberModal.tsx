import React, { useState, useEffect } from 'react';
import { usersApi } from '../../api/users.api';
import { User } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, UserPlus, Mail, ShieldAlert } from 'lucide-react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (email: string) => void;
  isLoading: boolean;
  existingMemberEmails: string[];
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
  isLoading,
  existingMemberEmails,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!emailInput.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const users = await usersApi.searchByEmail(emailInput);
        setSearchResults(users);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [emailInput]);

  const handleAddDirectly = (emailToAdd: string) => {
    onAddMember(emailToAdd);
    setEmailInput('');
    setSearchResults([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Project Member"
      description="Search users by email address to add them to this project."
    >
      <div className="space-y-4 mt-3">
        <Input
          label="User Email"
          placeholder="Search by email (e.g. member@example.com)"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          helperText="Type an email to search available users in the system"
        />

        {/* Search Results Dropdown / List */}
        {isSearching && (
          <p className="text-xs text-slate-400 py-2">Searching user database...</p>
        )}

        {!isSearching && searchResults.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-slate-200 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-900/60">
            {searchResults.map((user) => {
              const isAlreadyMember = existingMemberEmails.includes(user.email);

              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center justify-center font-semibold text-xs">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>

                  {isAlreadyMember ? (
                    <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">
                      Member
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddDirectly(user.email)}
                      isLoading={isLoading}
                      leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                    >
                      Add
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!isSearching && emailInput.trim() !== '' && searchResults.length === 0 && (
          <div className="p-4 text-center rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500">No users found matching "{emailInput}"</p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-2"
              onClick={() => handleAddDirectly(emailInput)}
              isLoading={isLoading}
            >
              Add {emailInput} directly
            </Button>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
