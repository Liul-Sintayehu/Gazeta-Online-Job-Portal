import { ClassDictionary } from 'clsx';

export const WorkTaskStatus: string[] = [
  'Pending',
  'ToDo',
  'In Progress',
  'Completed',
  'On Hold',
];

export const TaskStatus: ClassDictionary = {
  1: 'Pending',
  2: 'ToDo',
  3: 'In Progress',
  4: 'Completed',
  5: 'On Hold',
};

export const TaskStatusVariantMap: Record<
  number,
  'pending' | 'todo' | 'inprogress' | 'success' | 'destructive' | 'outline'
> = {
  1: 'pending',
  2: 'todo',
  3: 'inprogress',
  4: 'success',
  5: 'destructive',
  0: 'outline',
};

export const TaskStatusNumberMap: Record<string, number> = {
  pending: 1,
  todo: 2,
  inprogress: 3,
  success: 4,
  destructive: 5,
  default: 0,
};

export const TaskStatusValueMap: Record<string, number> = {
  Pending: 1,
  ToDo: 2,
  'In Progress': 3,
  Completed: 4,
  'On Hold': 5,
  default: 0,
};

export const IncidentStatus: string[] = [
  'Documented',
  'Reported',
  'Under Investigation',
  'Resolved',
  'Awaiting Action',
  'Escalated',
  'Canceled',
];

export const IncidentStatusMap: Record<number, string> = {
  1: 'Documented',
  2: 'Reported',
  3: 'Under Investigation',
  4: 'Resolved',
  5: 'Awaiting Action',
  6: 'Escalated',
  7: 'Canceled',
};

export const IncidentStatusVariantMap: Record<
  number,
  'pending' | 'todo' | 'inprogress' | 'success' | 'destructive' | 'default'
> = {
  1: 'todo',
  2: 'todo',
  3: 'inprogress',
  4: 'success',
  5: 'inprogress',
  6: 'destructive',
  7: 'destructive',
  0: 'default',
};

export const IncidentStatusNumberMap: Record<string, number> = {
  documented: 1,
  reported: 2,
  investigation: 3,
  resolved: 4,
  awaiting: 5,
  escalated: 6,
  canceled: 7,
  default: 0,
};

export const IncidentStatusValueMap: Record<string, number> = {
  Documented: 1,
  Reported: 2,
  'Under Investigation': 3,
  Resolved: 4,
  'Awaiting Action': 5,
  Escalated: 6,
  Canceled: 7,
  default: 0,
};
