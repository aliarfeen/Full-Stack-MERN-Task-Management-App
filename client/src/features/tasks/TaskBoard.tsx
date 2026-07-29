import React from 'react';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { Badge } from '../../components/ui/Badge';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface TaskBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onCreateTask: (initialStatus?: TaskStatus) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onCreateTask,
}) => {
  const columns = [
    {
      id: TaskStatus.TODO,
      title: 'To Do',
      color: 'border-t-slate-400 dark:border-t-slate-600',
      badgeVariant: 'default' as const,
    },
    {
      id: TaskStatus.IN_PROGRESS,
      title: 'In Progress',
      color: 'border-t-blue-500 dark:border-t-blue-400',
      badgeVariant: 'primary' as const,
    },
    {
      id: TaskStatus.DONE,
      title: 'Done',
      color: 'border-t-emerald-500 dark:border-t-emerald-400',
      badgeVariant: 'success' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);

        return (
          <div
            key={column.id}
            className={`flex flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40 border-t-4 ${column.color}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {column.title}
                </h3>
                <Badge variant={column.badgeVariant} size="sm">
                  {columnTasks.length}
                </Badge>
              </div>

              <button
                onClick={() => onCreateTask(column.id)}
                className="p-1 rounded text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                title={`Add task to ${column.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Tasks */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-20rem)] pr-1">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 py-8 text-center dark:border-slate-800">
                  <p className="text-xs text-slate-400">No tasks in {column.title.toLowerCase()}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => onCreateTask(column.id)}
                  >
                    + Add Task
                  </Button>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
