import React from 'react';
import { TaskFilters, TaskStatus, TaskPriority, User } from '../../types';
import { Filter, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface TaskFiltersProps {
  filters: TaskFilters;
  onFilterChange: (newFilters: TaskFilters) => void;
  onClearFilters: () => void;
  members: User[];
}

export const TaskFilterBar: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  members,
}) => {
  const hasActiveFilters = !!(filters.status || filters.priority || filters.assignee);

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
        <Filter className="w-4 h-4" />
        <span>Filter By:</span>
      </div>

      {/* Status Filter */}
      <select
        value={filters.status || ''}
        onChange={(e) =>
          onFilterChange({ ...filters, status: (e.target.value as TaskStatus) || '', page: 1 })
        }
        className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <option value="">All Statuses</option>
        <option value={TaskStatus.TODO}>TO DO</option>
        <option value={TaskStatus.IN_PROGRESS}>IN PROGRESS</option>
        <option value={TaskStatus.DONE}>DONE</option>
      </select>

      {/* Priority Filter */}
      <select
        value={filters.priority || ''}
        onChange={(e) =>
          onFilterChange({ ...filters, priority: (e.target.value as TaskPriority) || '', page: 1 })
        }
        className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <option value="">All Priorities</option>
        <option value={TaskPriority.LOW}>LOW</option>
        <option value={TaskPriority.MID}>MID</option>
        <option value={TaskPriority.HIGH}>HIGH</option>
      </select>

      {/* Assignee Filter */}
      <select
        value={filters.assignee || ''}
        onChange={(e) =>
          onFilterChange({ ...filters, assignee: e.target.value || '', page: 1 })
        }
        className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <option value="">All Assignees</option>
        {members.map((member) => (
          <option key={member._id} value={member._id}>
            {member.fullName} ({member.email})
          </option>
        ))}
      </select>

      {/* Clear Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          leftIcon={<X className="w-3.5 h-3.5" />}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};
