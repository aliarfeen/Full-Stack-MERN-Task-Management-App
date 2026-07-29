import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Calendar, User as UserIcon, Edit2, Trash2, ArrowRightLeft } from 'lucide-react';
import { formatDate, getInitials } from '../../utils/format';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return <Badge variant="danger">HIGH</Badge>;
      case TaskPriority.MID:
        return <Badge variant="warning" className="font-bold">MID</Badge>;
      case TaskPriority.LOW:
      default:
        return <Badge variant="default">LOW</Badge>;
    }
  };

  const assigneeName = typeof task.assignee === 'object' && task.assignee ? task.assignee.fullName : undefined;
  const assigneeEmail = typeof task.assignee === 'object' && task.assignee ? task.assignee.email : undefined;

  return (
    <Card className="flex flex-col justify-between h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {getPriorityBadge(task.priority)}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(task.dueDate)}</span>
          </div>

          <div className="flex items-center gap-1.5" title={assigneeEmail || 'Unassigned'}>
            {assigneeName ? (
              <>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  {getInitials(assigneeName)}
                </div>
                <span className="text-[11px] font-medium line-clamp-1 max-w-[80px]">
                  {assigneeName}
                </span>
              </>
            ) : (
              <span className="text-[11px] italic text-slate-400">Unassigned</span>
            )}
          </div>
        </div>

        {/* Quick Status Change Switcher Buttons */}
        <div className="flex items-center gap-1 pt-1 justify-end">
          <span className="text-[10px] uppercase font-semibold text-slate-400 mr-auto flex items-center gap-0.5">
            <ArrowRightLeft className="w-2.5 h-2.5" /> Move
          </span>

          {task.status !== TaskStatus.TODO && (
            <button
              onClick={() => onStatusChange(task._id, TaskStatus.TODO)}
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
            >
              To Do
            </button>
          )}

          {task.status !== TaskStatus.IN_PROGRESS && (
            <button
              onClick={() => onStatusChange(task._id, TaskStatus.IN_PROGRESS)}
              className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:hover:bg-blue-900 dark:text-blue-300 transition-colors"
            >
              In Progress
            </button>
          )}

          {task.status !== TaskStatus.DONE && (
            <button
              onClick={() => onStatusChange(task._id, TaskStatus.DONE)}
              className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 dark:text-emerald-300 transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
