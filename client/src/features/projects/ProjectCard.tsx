import React from 'react';
import { Link } from 'react-router-dom';
import { Project, ProjectStatus } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Users, Calendar, ArrowRight } from 'lucide-react';
import { formatDate, getInitials } from '../../utils/format';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusBadge = (status: ProjectStatus) => {
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

  const membersCount = project.members ? project.members.length : 0;
  const ownerName = project.owner ? project.owner.fullName : 'Unknown';

  return (
    <Card hoverable className="flex flex-col justify-between h-full group">
      <div>
        <CardHeader>
          <div className="flex items-center gap-2">
            {getStatusBadge(project.status)}
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(project.createdAt)}
          </span>
        </CardHeader>

        <CardContent>
          <Link to={`/projects/${project._id}`}>
            <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {project.title}
            </CardTitle>
          </Link>
          <CardDescription className="mt-2 line-clamp-2 min-h-[2.5rem]">
            {project.description}
          </CardDescription>
        </CardContent>
      </div>

      <CardFooter className="mt-4">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 overflow-hidden">
            {project.members && project.members.slice(0, 3).map((member) => (
              <div
                key={member._id}
                title={member.fullName}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 ring-2 ring-white dark:ring-slate-900"
              >
                {getInitials(member.fullName)}
              </div>
            ))}
            {membersCount > 3 && (
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-500 ring-2 ring-white dark:ring-slate-900">
                +{membersCount - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {membersCount} {membersCount === 1 ? 'member' : 'members'}
          </span>
        </div>

        <Link
          to={`/projects/${project._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
};
