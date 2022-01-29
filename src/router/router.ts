import { Listener, Match } from "./types";
import { updateLocation } from "../routing";

export default function Router(originLocation: string) {
  let listeners: Listener[] = [];
  let currentPath = "";
  let prevPath = "";
  let listenerId = 0;

  function isMatch(match: Match, path: string) {
    return !!(
      (match instanceof RegExp && match.test(path)) ||
      (typeof match === "function" && match(path)) ||
      match === path
    );
  }

  function handleListener({ match, onEnter, onLeave }: Listener) {
    currentPath = window.location.pathname.replace(/\/$/g, "");
    const args = {
      currentPath,
      prevPath,
      state: window.history.state,
      onLeave,
    };
    if (isMatch(match, currentPath)) {
      onEnter(args);
    }
    if (isMatch(match, prevPath)) {
      if (onLeave) onLeave(args);
    }
  }

  const on = function on(match: Match, onEnter: any, onLeave?: any) {
    const currentListenerId = listenerId;
    const listener = { id: currentListenerId, match, onEnter, onLeave };
    listenerId += 1;
    listeners.push(listener);
    return currentListenerId;
  };

  function handleListeners() {
    listeners.forEach((listener) => {
      handleListener(listener);
    });
  }

  const unsubscribe = (id: number) => {
    listeners = listeners.filter((val) => val.id !== id);
  };

  const go = function go(url: string, state?: any) {
    prevPath = currentPath;
    window.history.pushState(state, "", url);
    handleListeners();
  };
  window.addEventListener("popstate", () => {
    updateLocation(window.location.pathname, originLocation);
    handleListeners();
  });
  return { on, go, unsubscribe };
}
