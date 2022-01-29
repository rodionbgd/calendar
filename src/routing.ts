import Router from "./router/router";
import { renderCalendar, showTodayTodos } from "./render/calendar";
import { showYear } from "./filter/filter_todos";
import { calendar, monthWrapper, REPO_NAME, store } from "./index";
import { setMonthYear } from "./reducers";
import { constants } from "./constants";

function showCalendar() {
  const { dates, todos } = store.getState();
  renderCalendar(
    calendar,
    todos,
    new Date(dates.currentYear, dates.currentMonth, 1)
  );
  showTodayTodos(new Date(dates.currentDate));
}

export function createRouter(originLocation: string) {
  const router = Router(originLocation);
  router.on((path) => path === REPO_NAME, showCalendar);
  router.on(constants.YEAR_ROUTE, () => {
    const year = Number(
      window.location.pathname.match(constants.YEAR_ROUTE)![1]
    );
    const { currentMonth } = store.getState().dates;
    store.dispatch(
      setMonthYear({
        month: currentMonth,
        year,
      })
    );
    showYear(monthWrapper);
  });
  router.on(constants.YEAR_MONTH_ROUTE, showCalendar);

  return router;
}

export function updateLocation(href: string, originLocation: string) {
  if (!href || !originLocation) {
    return;
  }
  if (constants.YEAR_MONTH_ROUTE.test(href)) {
    const year = Number(href.match(constants.YEAR_ROUTE)![1]);
    const month = href.match(constants.MONTH_ROUTE)![1];
    store.dispatch(
      setMonthYear({
        month: constants.MONTH_REF.indexOf(month),
        year,
      })
    );
  } else if (href === "/" || href === originLocation) {
    store.dispatch(
      setMonthYear({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      })
    );
  }
}
