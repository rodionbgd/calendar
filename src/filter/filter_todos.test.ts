import { Todo, TodoObj } from "../types";
import generateTodo from "../utils";
import { filterTodos } from "./filter_todos";
import { constantsTodo } from "../todo/constants_todo";

describe("Filtering todos", () => {
  let todos: TodoObj[];
  beforeEach(() => {
    todos = generateTodo();
  });

  describe("Filter by date", () => {
    let filter: Partial<Todo>;
    test("Filter by date from", () => {
      filter = { date1: `${new Date()}` };
      let filteredTodos = filterTodos(todos, filter);
      expect(filteredTodos).toHaveLength(todos.length);
    });
    test("Filter by date to", () => {
      filter = { date2: `${new Date()}` };
      let filteredTodos = filterTodos(todos, filter);
      expect(filteredTodos).toHaveLength(1);
    });
    test("Filter by date", () => {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      filter = { date1: `${new Date()}`, date2: `${date}` };
      let filteredTodos = filterTodos(todos, filter);
      expect(filteredTodos).toHaveLength(3);
    });
  });
  test("Filter by task", () => {
    const filter = { task: "f" };
    //first, four, five
    let filteredTodos = filterTodos(todos, filter);
    expect(filteredTodos).toHaveLength(3);
  });

  test("Filter by status", () => {
    const filter = { status: constantsTodo.TASK_IN_PROCESS[0] };
    let filteredTodos = filterTodos(todos, filter);
    expect(filteredTodos).toHaveLength(3);
  });
  test("Filter by tags", () => {
    const filter = { tags: ["four", "one"] };
    // four, one
    let filteredTodos = filterTodos(todos, filter);
    expect(filteredTodos).toHaveLength(2);
  });
});
