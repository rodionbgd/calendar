import "./css/style.css";

import { configureStore } from "@reduxjs/toolkit";
import { constants } from "./constants";
import {
  setPrevMonth,
  setNextMonth,
  setMonthYear,
  datesSlice,
} from "./reducers";
import { renderCalendar, renderPopover } from "./render/calendar";

export const store = configureStore({
  reducer: {
    dates: datesSlice.reducer,
  },
});

function init() {
  const prevMonthBtn = <HTMLButtonElement>(
    document.getElementById("prev-month-btn")
  );
  const nextMonthBtn = <HTMLButtonElement>(
    document.getElementById("next-month-btn")
  );
  const todayBtn = <HTMLButtonElement>document.getElementById("today-btn");
  const popover = <HTMLElement>document.getElementById("popover");
  const popoverContent = <HTMLElement>(
    document.getElementById("popover-content")
  );
  const currentMonthBtn = <HTMLButtonElement>(
    document.getElementById("current-month-btn")
  );
  const currentYearBtn = <HTMLButtonElement>(
    document.getElementById("current-year-btn")
  );
  const calendar = <HTMLElement>document.getElementById("calendar");

  store.subscribe(() => {
    const { dates } = store.getState();
    currentMonthBtn.innerHTML = constants.MONTH[dates.currentMonth];
    currentYearBtn.innerHTML = `${dates.currentYear}`;
    renderCalendar(
      calendar,
      new Date(dates.currentYear, dates.currentMonth, 1)
    );
  });
  store.dispatch(
    setMonthYear({
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    })
  );
  renderCalendar(calendar);
  prevMonthBtn.addEventListener("click", () => {
    store.dispatch(setPrevMonth());
  });
  nextMonthBtn.addEventListener("click", () => {
    store.dispatch(setNextMonth());
  });
  todayBtn.addEventListener("click", () => {
    store.dispatch(
      setMonthYear({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      })
    );
  });

  document.body.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!target) {
      return;
    }
    if (target === currentMonthBtn) {
      const offset = currentMonthBtn.clientWidth;
      renderPopover({
        popover,
        popoverContent,
        offset,
        type: "month",
        data: constants.MONTH,
      });
      return;
    }
    if (target === currentYearBtn) {
      const offset =
        2 * currentMonthBtn.clientWidth + currentYearBtn.clientWidth;
      const years = Array.from({ length: 10 }, (_, i) => i + 2015);
      renderPopover({
        popover,
        popoverContent,
        offset,
        type: "year",
        data: years,
      });
      return;
    }
    const popoverTarget = (e.target as HTMLElement).closest(
      "#popover"
    ) as HTMLElement;
    if (!popoverTarget) {
      popover.style.display = "none";
      return;
    }
    const month = target.dataset.month
      ? constants.MONTH.indexOf(target.dataset.month)
      : store.getState().dates.currentMonth;
    const year = target.dataset.year
      ? Number(target.dataset.year)
      : store.getState().dates.currentYear;
    store.dispatch(
      setMonthYear({
        month,
        year,
      })
    );
    popover.style.display = "none";
  });
}

window.addEventListener("load", init);
