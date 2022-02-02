import { Store } from "redux";
import Router from "./router/router";
import { renderCalendar, showTodayTodos, showYear } from "./render/calendar";
import { calendar, calendarWrapper, monthWrapper } from "./elements";
import { setMonthYear } from "./reducers";
import { constants } from "./constants";
import { REPO_NAME, store } from "./index";

export function showCalendar() {
  const { dates, todos } = store.getState();
  renderCalendar(
    calendar,
    { calendarWrapper, monthWrapper },
    todos,
    new Date(dates.currentYear, dates.currentMonth, 1)
  );
  showTodayTodos(new Date(dates.currentDate), todos);
}

export function createRouter(originLocation: string, wrapperEl?: HTMLElement) {
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
    const wrapper = wrapperEl || monthWrapper;
    if (wrapper) {
      showYear(wrapper);
    }
  });
  router.on(constants.YEAR_MONTH_ROUTE, showCalendar);

  return router;
}

export function updateLocation(
  href: string,
  originLocation: string,
  s?: Store
) {
  if (!href) {
    return;
  }
  let storeOriginal = store;
  if (s) {
    storeOriginal = s;
  }
  if (constants.YEAR_MONTH_ROUTE.test(href)) {
    const year = Number(href.match(constants.YEAR_ROUTE)![1]);
    const month = href.match(constants.MONTH_ROUTE)![1];
    storeOriginal.dispatch(
      setMonthYear({
        month: constants.MONTH_REF.indexOf(month),
        year,
      })
    );
  } else if (href === "/" || href === originLocation) {
    storeOriginal.dispatch(
      setMonthYear({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      })
    );
  }
}
