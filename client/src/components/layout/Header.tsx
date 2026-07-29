import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { LogOut } from 'lucide-react';
import { getInitials } from '../../utils/format';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
          TaskFlow
        </h1>
      </div>

      <div className="flex items-center gap-4">

        {/* User Info & Badge */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm shadow-xs">
              {getInitials(user.fullName)}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-tight">
                {user.fullName}
              </span>
              <span className="text-xs text-slate-400">{user.email}</span>
            </div>
            <Badge
              variant={user.role === 'ADMIN' ? 'purple' : 'info'}
              size="sm"
              className="ml-1"
            >
              {user.role}
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="ml-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
