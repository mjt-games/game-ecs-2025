import { Tick } from "@mjt-engine/animate";
import { isDefined, isUndefined } from "@mjt-engine/object";
import { queryFilter } from "../common/queryFilter";
import { EcsBridgeMap } from "./EcsBridgeMap";
import { EcsBridge } from "./EcsBridge";
import { Component } from "../type/Component";
import { Entity } from "../type/Entity";

export const SystemLoop = async <Components extends Component[]>({
  signal,
  entities = [],
  registrations = [],
  windows = [window],
  defaultTimeoutMs = 1000,
}: Partial<{
  signal: AbortSignal;
  entities: Entity<Components>[];
  registrations: EcsBridgeMap<Components>["registerQuery"]["request"][];
  windows: Window[];
  defaultTimeoutMs: number;
}> = {}) => {
  const updateEntities = (
    updatedEntities: Entity<Components>[],
    ids: number[]
  ) => {
    if (ids.length !== updatedEntities.length) {
      return;
    }
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const updatedEntity = updatedEntities[i];
      entities[id] = updatedEntity as Entity<Components>;
    }
  };

  const bridge = await EcsBridge({
    signal,
    windows,
    options: {
      defaultTimeoutMs,
    },
    subscribers: {
      log: (message) => {
        console.log("Log message:", message);
      },
      registerQuery: async (request) => {
        registrations.push(
          request as EcsBridgeMap<Components>["registerQuery"]["request"]
        );
      },
      add: async (request) => {
        console.log("Add request:", request);
        entities.push(request as Entity<Components>);
      },
      update: async (request) => {
        console.log("Update request:", request);
        const { entities: updatedEntities, ids } = request;
        updateEntities(updatedEntities as Entity<Components>[], ids);
      },
    },
  });

  const update = async (tick?: Tick) => {
    for (const registration of registrations) {
      const { name, query } = registration;
      try {
        const filteredEntities = isUndefined(query)
          ? []
          : queryFilter(query)(entities);
        const result = await bridge.bus.request(
          `runSystem.${name}` as "runSystem",
          {
            entities: filteredEntities as Entity<any>[],
            ids: filteredEntities.map((e) => entities.indexOf(e)),
            name,

            // @ts-ignore
            serialId: crypto.randomUUID(),
          }
        );
        const { add, update } = result.data;
        if (isDefined(update)) {
          updateEntities(
            update.entities as Entity<Components>[],
            update.ids as number[]
          );
        }
        if (isDefined(add) && add.length > 0) {
          entities.push(...(add as Entity<Components>[]));
        }
      } catch (e) {
        console.error("Error in system loop: registration", registration);
        console.error(`Error in system: name: ${name}`, e);
      }
    }
  };

  return { entities, registrations, bridge, update };
};
