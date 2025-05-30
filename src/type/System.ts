import { Component } from "./Component";
import { Entity } from "./Entity";

export type System<Components extends Component[]> = (
  entities: Entity<Components>[],
  ids: number[]
) =>
  | void
  | Entity<Components>[]
  | Entity<Components>
  | Promise<void | Entity<Components>[] | Entity<Components>>;
