import { Component } from "./Component";
import { Query } from "./Query";
import { System } from "./System";

export type QuerySystem<Components extends Component[]> = {
  name?: string;
  query?: Query<Components>;
  system: System<any>;
};
