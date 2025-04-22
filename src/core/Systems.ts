import { toMany } from "@mjt-engine/object";
import { LazyObjects } from "../common/LazyObjects";
import { Component } from "../type/Component";
import { Entity } from "../type/Entity";
import { Query } from "../type/Query";
import { System } from "../type/System";
import { EcsBridgeMessageBus } from "./EcsBridgeMessageBus";

export const Systems = <Components extends Component[]>(
  bus: Awaited<ReturnType<typeof EcsBridgeMessageBus<Components>>>
) => {
  const nameToSystem = new Map<string, System<Components>>();
  const register = async ({
    name = `sys-${Date.now()}-${crypto.randomUUID()}`,
    query,
    system,
  }: {
    name?: string;
    query?: Query<Components>;
    system: System<Components>;
  }) => {
    nameToSystem.set(name, system);
    bus.subscribe("runSystem", async (request) => {
      const { entities, ids, name } = request;
      const system = nameToSystem.get(name);
      if (!system) {
        throw new Error(`System ${name} not found`);
      }

      const lazy = LazyObjects();
      lazy.setSuppressDirty(true);
      const lazyEntities = entities.map((entity) => lazy.from(entity as any));
      lazy.setSuppressDirty(false);
      const addedEntities = await system(lazyEntities as Entity<Components>[], [
        ...lazyEntities.map((e, i) => i),
      ]);
      const dirtyEntities = lazyEntities.filter((e) => lazy.isDirty(e));
      return {
        update: {
          // TODO pick out just the dirty entities for update
          entities:
            dirtyEntities.length > 0
              ? (lazyEntities.map((e) => lazy.toPlain(e)) as any[])
              : [],
          ids,
        },
        add: toMany(addedEntities ?? []),
      };
    });

    await bus.request("registerQuery", { name, query });
    return name;
  };
  return { register };
};
