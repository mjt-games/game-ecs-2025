import { Component } from "./Component";

export type ComponentSelector<C extends Component, N extends keyof C> = {
  namespace: N;
  key: keyof C[N];
};
