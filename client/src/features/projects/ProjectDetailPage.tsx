import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProjectDetail } from './useProjects';
import { useTasks } from '../tasks/useTasks';
import { MembersPanel } from './MembersPanel';
import { EditProjectModal } from './EditProjectModal';
import { TaskBoard } from '../tasks/TaskBoard';
import { TaskTable } from '../tasks/TaskTable';
import { TaskFilterBar } from '../tasks/TaskFilters';
import { CreateTaskModal } from '../tasks/CreateTaskModal';
import { EditTaskModal } from '../tasks/EditTaskModal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { TaskFilters, TaskStatus, TaskPriority, Task, ProjectStatus } from '../../types';
import {
  ArrowLeft,
  Plus,
  Kanban,
  Table as TableIcon,
  Settings,
  Trash2,
  Calendar,
  User as UserIcon,
} from 'lucide-react';
import { formatDate } from '../../utils/format';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = id || '';

  const {
    project,
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
    refetch: refetchProject,
    updateProject,
    isUpdating: isUpdatingProject,
    deleteProject,
    isDeleting: isDeletingProject,
    addMember,
    isAddingMember,
    removeMember,
    isRemovingMember,
  } = useProjectDetail(projectId);

  // View state: Kanban (board) or Table
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

  // Filter state
  const [filters, setFilters] = useState<TaskFilters>({
    status: '',
    priority: '',
    assignee: '',
    page: 1,
    limit: 10,
  });

  const {
    tasks,
    total,
    page,
    limit,
    isLoading: isTasksLoading,
    createTask,
    isCreating: isCreatingTask,
    updateTask,
    isUpdating: isUpdatingTask,
    updateStatus,
    deleteTask,
  } = useTasks(projectId, filters);

  // Modals state
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [initialTaskStatus, setInitialTaskStatus] = useState<TaskStatus | undefined>(undefined);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  if (isProjectLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isProjectError || !project) {
    return (
      <div className="py-12">
        <ErrorState
          title="Project Not Found"
          message={projectError || 'The project could not be found or you lack access permissions.'}
          onRetry={refetchProject}
        />
        <div className="text-center mt-4">
          <Link to="/dashboard" className="text-sm font-semibold text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleOpenCreateTask = (status?: TaskStatus) => {
    setInitialTaskStatus(status);
    setIsCreateTaskOpen(true);
  };

  const handleDeleteProjectConfirm = () => {
    deleteProject(undefined, {
      onSuccess: () => navigate('/dashboard'),
    });
  };

  const getProjectStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.DONE:
        return <Badge variant="success">DONE</Badge>;
      case ProjectStatus.IN_PROGRESS:
        return <Badge variant="primary">IN PROGRESS</Badge>;
      case ProjectStatus.PENDING:
      default:
        return <Badge variant="warning">PENDING</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb / Back button */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      {/* Project Header Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {project.title}
              </h1>
              {getProjectStatusBadge(project.status)}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Created {formatDate(project.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5" /> Owner:{' '}
                {typeof project.owner === 'object' ? project.owner.fullName : 'Owner'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditProjectOpen(true)}
              leftIcon={<Settings className="w-4 h-4" />}
            >
              Settings
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsDeleteProjectOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <MembersPanel
        project={project}
        onAddMember={addMember}
        onRemoveMember={removeMember}
        isAddingMember={isAddingMember}
        isRemovingMember={isRemovingMember}
      />

      {/* Task Toolbar: Title, View Switcher & Add Task Button */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Task Management</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage tasks in Kanban board or tabular view
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-900">
              <button
                onClick={() => setViewMode('board')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  viewMode === 'board'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" /> Board
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" /> Table
              </button>
            </div>

            <Button
              size="sm"
              onClick={() => handleOpenCreateTask()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              New Task
            </Button>
          </div>
        </div>

        {/* Task Filters Bar */}
        <TaskFilterBar
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={() => setFilters({ status: '', priority: '', assignee: '', page: 1, limit: 10 })}
          members={project.members || []}
        />

        {/* Task View Content */}
        {isTasksLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : viewMode === 'board' ? (
          <TaskBoard
            tasks={tasks}
            onEditTask={setEditingTask}
            onDeleteTask={setDeletingTaskId}
            onStatusChange={(taskId, newStatus) => updateStatus({ id: taskId, status: newStatus })}
            onCreateTask={handleOpenCreateTask}
          />
        ) : (
          <TaskTable
            tasks={tasks}
            total={total}
            page={page}
            limit={limit}
            onPageChange={(newPage) => setFilters((prev) => ({ ...prev, page: newPage }))}
            onEditTask={setEditingTask}
            onDeleteTask={setDeletingTaskId}
            onStatusChange={(taskId, newStatus) => updateStatus({ id: taskId, status: newStatus })}
          />
        )}
      </div>

      {/* Modals & Dialogs */}
      <EditProjectModal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        project={project}
        onSubmit={updateProject}
        isLoading={isUpdatingProject}
      />

      <ConfirmDialog
        isOpen={isDeleteProjectOpen}
        onClose={() => setIsDeleteProjectOpen(false)}
        onConfirm={handleDeleteProjectConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.title}"? This will permanently delete the project and all of its tasks.`}
        confirmText="Delete Project"
        isLoading={isDeletingProject}
      />

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSubmit={createTask}
        isLoading={isCreatingTask}
        members={project.members || []}
        defaultStatus={initialTaskStatus}
      />

      {editingTask && (
        <EditTaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask}
          onSubmit={(taskId, data) => updateTask({ id: taskId, data })}
          isLoading={isUpdatingTask}
          members={project.members || []}
        />
      )}

      {deletingTaskId && (
        <ConfirmDialog
          isOpen={!!deletingTaskId}
          onClose={() => setDeletingTaskId(null)}
          onConfirm={() => {
            deleteTask(deletingTaskId);
            setDeletingTaskId(null);
          }}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmText="Delete Task"
        />
      )}
    </div>
  );
};
