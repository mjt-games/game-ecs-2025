import { Component } from "./Component";

// Utility to merge many components into one entity
export type Entity<Components extends Component[]> = UnionToIntersection<
  Components[number]
>;
// Helper: Union to Intersection
type UnionToIntersection<U> = (U extends any ? (x: U) => any : never) extends (
  x: infer I
) => any ? I : never;
