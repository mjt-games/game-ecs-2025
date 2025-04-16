import { Component } from "../type/Component";
import { Entity } from "../type/Entity";
import { Query } from "../type/Query";

type CoreIdComponent = Component<"core", "id", number>;
type CoreTagComponent = Component<"core", "tag", string[]>;
type PositionComponent = Component<
  "world",
  "position",
  { x: number; y: number; z?: number }
>;
export type System<Components extends Component[]> = (
  entities: Entity<Components>[]
) => Entity<Components>[] | void | null | undefined;

export type CoreRegisterSystemMessage<Components extends Component[]> =
  Component<
    "core",
    "registerSystem",
    {
      name: string;
      query: Query<Components>;
    }
  >;

export type CoreRunSystemMessage<Components extends Component[]> = Component<
  "core",
  "runSystem",
  {
    name: string;
    entities: Entity<Components>[];
  }
>;

export const Systems = () => {
  const systems: System<any>[] = [];

  const addSystem = <Components extends Component[]>(
    system: System<Components>
  ) => {
    systems.push(system);
  };

  return {
    addSystem,
    systems,
  };
};
