import { Store } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { datesSlice, todoSlice } from "./reducers";
import * as Calendar from "./render/calendar";
import { bodyInnerHTML } from "./body_inner_html";
import { createRouter, updateLocation } from "./routing";
import { REPO_NAME } from "./index";
import { constants } from "./constants";

jest.mock("./render/calendar", () => ({
  showYear: jest.fn(),
  renderCalendar: jest.fn(),
  showTodayTodos: jest.fn(),
}));

describe("Routing", () => {
  let store: Store;
  let monthWrapper: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = bodyInnerHTML;
    store = configureStore({
      reducer: {
        dates: datesSlice.reducer,
        todos: todoSlice.reducer,
      },
    });
    monthWrapper = <HTMLElement>document.getElementById("month-wrapper");
  });

  test("Creating router", () => {
    const router = createRouter("/", monthWrapper);
    router.go("/year/2020");
    expect(router).toHaveProperty("on");
    expect(Calendar.showYear).toHaveBeenCalled();
    router.go(REPO_NAME);
    const { dates } = store.getState();
    const date = new Date(dates.currentDate);
    expect(Calendar.showTodayTodos).toHaveBeenCalledWith(date, []);
  });

  describe("Updating location", () => {
    test("Invalid arguments", () => {
      const { dates } = store.getState();
      updateLocation("", "", store);
      expect(dates).toStrictEqual(store.getState().dates);
    });
    test("Updating month and year", () => {
      const month = "dec";
      const year = 2020;
      updateLocation(`/year/${year}/month/${month}`, "/", store);
      const { dates } = store.getState();
      expect(dates.currentMonth).toBe(constants.MONTH_REF.indexOf(month));
      expect(dates.currentYear).toBe(year);
    });
    test("Current month and year", () => {
      updateLocation("/", "/", store);
      const currentDate = new Date();
      const { dates } = store.getState();
      expect(dates.currentMonth).toBe(currentDate.getMonth());
      expect(dates.currentYear).toBe(currentDate.getFullYear());
    });
  });
});
