import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, getInitials } from '../../utils/format';

interface TaskTableProps {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  total,
  page,
  limit,
  onPageChange,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}) => {
  const totalPages = Math.ceil(total / limit) || 1;

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return <Badge variant="success">DONE</Badge>;
      case TaskStatus.IN_PROGRESS:
        return <Badge variant="primary">IN PROGRESS</Badge>;
      case TaskStatus.TODO:
      default:
        return <Badge variant="default">TO DO</Badge>;
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return <Badge variant="danger">HIGH</Badge>;
      case TaskPriority.MID:
        return <Badge variant="warning">MID</Badge>;
      case TaskPriority.LOW:
      default:
        return <Badge variant="default">LOW</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                No tasks match current filters.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => {
              const assigneeName = typeof task.assignee === 'object' && task.assignee ? task.assignee.fullName : null;

              return (
                <TableRow key={task._id}>
                  <TableCell>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="text-xs text-slate-400 line-clamp-1">
                          {task.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
                      className="text-xs rounded border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value={TaskStatus.TODO}>TO DO</option>
                      <option value={TaskStatus.IN_PROGRESS}>IN PROGRESS</option>
                      <option value={TaskStatus.DONE}>DONE</option>
                    </select>
                  </TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>
                    {assigneeName ? (
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                          {getInitials(assigneeName)}
                        </div>
                        <span className="text-xs">{assigneeName}</span>
                      </div>
                    ) : (
                      <span className="text-xs italic text-slate-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">{formatDate(task.dueDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => onEditTask(task)}
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                        onClick={() => onDeleteTask(task._id)}
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs text-slate-500">
          <span>
            Showing page {page} of {totalPages} ({total} total tasks)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
