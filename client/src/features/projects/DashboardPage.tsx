import React, { useState } from 'react';
import { useProjects } from './useProjects';
import { ProjectCard } from './ProjectCard';
import { CreateProjectModal } from './CreateProjectModal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Plus, Search, FolderPlus, Filter } from 'lucide-react';
import { ProjectStatus } from '../../types';

export const DashboardPage: React.FC = () => {
  const { projects, isLoading, isError, error, refetch, createProject, isCreating } = useProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your project workspaces and team assignments
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          New Project
        </Button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="ALL">All Statuses</option>
            <option value={ProjectStatus.PENDING}>PENDING</option>
            <option value={ProjectStatus.IN_PROGRESS}>IN_PROGRESS</option>
            <option value={ProjectStatus.DONE}>DONE</option>
          </select>
        </div>
      </div>

      {/* Content States */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-xl border border-slate-200 p-5 space-y-4 dark:border-slate-800">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderPlus className="w-12 h-12 text-slate-400" />}
          title={searchQuery || statusFilter !== 'ALL' ? 'No projects match filters' : 'No projects found'}
          description={
            searchQuery || statusFilter !== 'ALL'
              ? 'Try adjusting your search criteria or clearing filters.'
              : 'Get started by creating your first project workspace.'
          }
          actionLabel={searchQuery || statusFilter !== 'ALL' ? undefined : 'Create Project'}
          onAction={searchQuery || statusFilter !== 'ALL' ? undefined : () => setIsCreateModalOpen(true)}
          actionIcon={<Plus className="w-4 h-4" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createProject}
        isLoading={isCreating}
      />
    </div>
  );
};
