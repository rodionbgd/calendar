export type Todo = {
  task: string;
  date1: string;
  date2?: string;
  status: string;
  tags?: string[];
};

export type TodoObj = Record<string, Todo>;
