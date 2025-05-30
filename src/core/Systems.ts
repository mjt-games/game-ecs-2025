import { toMany } from "@mjt-engine/object";
import { LazyObjects } from "../common/LazyObjects";
import { Component } from "../type/Component";
import { Entity } from "../type/Entity";
import { Query } from "../type/Query";
import { System } from "../type/System";
import { EcsBridge } from "./EcsBridge";

export const Systems = <Components extends Component[]>(
  bridge: Awaited<ReturnType<typeof EcsBridge<Components>>>
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
    bridge.bus.subscribe(
      `runSystem.${name}` as "runSystem",
      async (request) => {
        // @ts-ignore
        const { entities, ids, name: requestName, serialId } = request;
        if (requestName !== name) {
          return {
            update: {
              entities: [],
              ids: [],
            },
            add: [],
          };
        }

        const system = nameToSystem.get(name);
        if (!system) {
          throw new Error(`System ${name} not found`);
        }

        const lazy = LazyObjects();
        lazy.setSuppressDirty(true);
        const lazyEntities = entities.map((entity) => lazy.from(entity as any));
        lazy.setSuppressDirty(false);
        const addedEntities = await system(
          lazyEntities as Entity<Components>[],
          [...lazyEntities.map((e, i) => i)]
        );
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
      }
    );

    await bridge.bus.request("registerQuery", { name, query });
    return name;
  };
  return { register };
};
