import { Component } from "./Component";
import { Entity } from "./Entity";
import { StringSelectors } from "./StringSelectors";


export type Query<Components extends Component[]> = Partial<{
  has: StringSelectors<Entity<Components>>[] |
  StringSelectors<Entity<Components>>;
  not: StringSelectors<Entity<Components>>[] |
  StringSelectors<Entity<Components>>;
  match: {
    key: StringSelectors<Entity<Components>>;
    // r = regex, ri = regex ignore case
    op?: "==" | "ri" | "r" | "!=" | ">" | "<" | ">=" | "<=" | "!" | "contains";
    value?: string | number | boolean | string[] | number[] | boolean[];
  };
  and: Query<Components>;
  or: Query<Components>;
}>;
