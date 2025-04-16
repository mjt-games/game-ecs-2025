import { Component } from "./Component";
export type Entity<Components extends Component[]> = UnionToIntersection<Components[number]>;
type UnionToIntersection<U> = (U extends any ? (x: U) => any : never) extends (x: infer I) => any ? I : never;
export {};
