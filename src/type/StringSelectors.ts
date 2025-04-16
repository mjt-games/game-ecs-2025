/**  String form selectors like "core.id" */

export type StringSelectors<E> = {
  [NS in keyof E & string]: {
    [K in keyof E[NS] & string]: `${NS}.${K}`;
  }[keyof E[NS] & string];
}[keyof E & string];
