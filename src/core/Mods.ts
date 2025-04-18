import { Component } from "../type/Component";
import { Query } from "../type/Query";
import { Bridges } from "./Bridges";
import { System } from "../type/System";
import { Entity } from "../type/Entity";
import { LazyObjects } from "../common/LazyObjects";

export const Mods = <Components extends Component[]>() => {
  const nameToSystem = new Map<string, System<Components>>();
  const bridges = Bridges<Components>();
  const register = ({
    name = crypto.randomUUID(),
    query,
    system,
  }: {
    name?: string;
    query?: Query<Components>;
    system: System<Components>;
  }) => {
    bridges.addListener({
      eventType: "log",
      listener: (payload) => {
        console.log("Log message:", payload);
      },
    });

    nameToSystem.set(name, system);
    bridges.addListener({
      eventType: "runSystem",
      listener: (event) => {
        const { payload, type } = event;
        const system = nameToSystem.get(payload.name);
        if (!system) {
          console.error(`System ${payload.name} not found`);
          return;
        }
        try {
          const lazy = LazyObjects();
          lazy.setSuppressDirty(true);
          const lazyEntities = payload.entities.map((entity) =>
            lazy.from(entity as any)
          );
          lazy.setSuppressDirty(false);
          const addedEntities = system(
            lazyEntities as Entity<Components>[],
            [...lazyEntities.map((e, i) => i)]
            // payload.entities
          ) as Entity<Components>[];
          if (addedEntities) {
            bridges.post({
              type: "add",
              payload: addedEntities,
            });
          }
          const dirtyEntities = lazyEntities.filter((e) => lazy.isDirty(e));
          if (dirtyEntities.length > 0) {
            bridges.post({
              type: "update",
              // payload: dirtyEntities.map((e) => lazy.toPlain(e)) as any[],
              // TODO only transfer across the dirty entities
              payload: {
                entities: lazyEntities.map((e) => lazy.toPlain(e)) as any[],
                ids: payload.ids,
              },
            });
          }
        } catch (e) {
          bridges.post({
            type: "error",
            payload: `Error in system ${type}: ${e}`,
          });
          return;
        }
      },
    });
    bridges.post({
      type: "registerQuery",
      payload: { name, query },
    });
  };
  return { register };
};
