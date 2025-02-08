import { ColumnDef } from '@tanstack/react-table';

export interface Aircraft {
  id: number;
  aircraftTypeCode: string;
  aircraftTypeName: string;
  recordStatus: number;
}

export interface MajorTask {
  id: number;
  name: string;
  description: string;
  recordStatus: number;
}
export interface Task {
  id: number;
  name: string;
  description: string;
  majorTaskId: number;
  parentTaskId: number;
  aircraftTypeId: number;
  parentTask: ParentTask;
  majorTask: MajorTask;
  aircraftType: Aircraft;
  recordStatus: number;
}
 

interface ParentTask {
  id: number;
  name: string;
  description: string;
  majorTaskId: number;
  parentTaskId: number;
  aircraftTypeId: number;
  parentTask: ParentTask | null;
  majorTask: MajorTask;
  aircraftType: Aircraft;
  recordStatus: number;
}