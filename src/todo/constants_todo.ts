export const constantsTodo: Record<string, any> = {
  // CRUD status
  STATUS_OK: "OK",
  STATUS_ERROR: "ERROR",

  // Storage type
  STORAGE_LOCAL: "LOCAL",
  STORAGE_DB: "DB",

  // Task status
  TASK_IN_PROCESS: ["TASK_IN_PROCESS", "в процессе"],
  TASK_FULFILLED: ["TASK_FULFILLED", "выполнено"],
  TASK_EXPIRED: ["TASK_EXPIRED", "истекло"],

  UPDATE: "update",
  DELETE: "delete",

  // Process mode
  ADD_MODE: "add",
  FILTER_MODE: "filter",
};
