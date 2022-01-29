export type Match = RegExp | ((args?: any) => any) | string;

export type Listener = {
  match: Match;
  onEnter: (args: any) => any;
  onLeave: (args: any) => any;
  id?: number;
};
