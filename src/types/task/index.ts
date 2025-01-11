// src/types/task.ts
export interface Subtask {
  id: string;
  name: string;
  description?: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status: 'none' | 'in-progress' | 'completed';
  priority: 'Urgent' | 'High' | 'Normal' | 'Low';
  taskId: string;
}

export interface Task {
  id: string;
  teamId: string;
  name: string;
  description?: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'archived';
  priority: 'Urgent' | 'High' | 'Normal' | 'Low';
  subtasks?: Subtask[];
}

export interface TaskResponse {
  data: Task[];
  total: number; // if you need pagination
}

export interface CreateTaskPayload {
  teamId: string;
  name: string;
  description?: string;
  plannedStartDate: string;
  plannedEndDate: string;
  priority: 'Urgent' | 'High' | 'Normal' | 'Low';
}

export interface UpdateTaskStatusPayload {
  taskId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'archived';
}
