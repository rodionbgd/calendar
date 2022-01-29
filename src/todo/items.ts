import { constantsTodo } from "./constants_todo";

interface stringObjectType {
  [key: string]: string[] | string | Date | undefined;
}

export interface schemaType extends stringObjectType {
  task: string;
  date1: string;
  date2?: string;
  status: string;
  tags: string[];
}

export const schema: schemaType = {
  task: "",
  date1: `${new Date(new Date().setMonth(new Date().getMonth() + 1))}`,
  // date2: JSON.stringify(new Date(new Date().setMonth(new Date().getMonth() + 4))),
  status: constantsTodo.TASK_IN_PROCESS[0],
  tags: [],
};
