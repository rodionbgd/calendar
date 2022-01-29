import { constantsTodo } from "./todo/constants_todo";
import { TodoObj } from "./types";
import { todoAPI } from "./index";

const items = [
  {
    task: "first",
    date1: `${new Date(new Date().setDate(new Date().getDate() + 1))}`,
    status: constantsTodo.TASK_EXPIRED[0],
    tags: ["one", "one_one"],
  },
  {
    task: "second",
    date1: `${new Date(new Date().setDate(new Date().getDate() + 4))}`,
    date2: `${new Date(new Date().setDate(new Date().getDate() + 6))}`,
    status: constantsTodo.TASK_IN_PROCESS[0],
    tags: ["two", "two_two"],
  },
  {
    task: "three",
    date1: `${new Date(new Date().setDate(new Date().getDate() + 3))}`,
    status: constantsTodo.TASK_FULFILLED[0],
    tags: ["three", "two_two"],
  },
  {
    task: "four",
    date1: `${new Date(new Date().setDate(new Date().getDate() - 25))}`,
    date2: `${new Date(new Date().setDate(new Date().getDate() + 22))}`,
    status: constantsTodo.TASK_EXPIRED[0],
    tags: ["four", "four_two"],
  },
  {
    task: "five",
    date1: `${new Date(new Date().setDate(new Date().getDate() + 4))}`,
    status: constantsTodo.TASK_IN_PROCESS[0],
    tags: ["four", "four_two"],
  },
  {
    task: "six",
    date1: `${new Date(new Date().setDate(new Date().getDate() + 4))}`,
    status: constantsTodo.TASK_IN_PROCESS[0],
    tags: ["four", "four_two"],
  },
];

export default function generateTodo() {
  localStorage.clear();
  const todoList: TodoObj[] = [];
  items.forEach(async (item) => {
    await todoAPI.createItem(item);
  });
  Object.entries(localStorage).forEach(([key, todo]) => {
    const newTodo = { [key]: JSON.parse(todo) };
    todoList.push(newTodo);
  });
  return todoList;
}
