import { Tick } from "@mjt-engine/animate";
import { isUndefined } from "@mjt-engine/object";
import { queryFilter } from "../../common/queryFilter";
import { EcsBridgeMap } from "../../core/EcsBridgeMap";
import { EcsBridgeMessageBus } from "../../core/EcsBridgeMessageBus";
import { Component } from "../../type/Component";
import { Entity } from "../../type/Entity";

export const SystemLoop = async <Components extends Component[]>({
  signal,
  entities = [],
  registrations = [],
}: Partial<{
  signal: AbortSignal;
  entities: Entity<Components>[];
  registrations: EcsBridgeMap<Components>["registerQuery"]["request"][];
}> = {}) => {
  const updateEntities = (
    updatedEntities: Entity<Components>[],
    ids: number[]
  ) => {
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const updatedEntity = updatedEntities[i];
      entities[id] = updatedEntity as Entity<Components>;
    }
  };

  const bus = await EcsBridgeMessageBus({
    signal,
    options: {
      defaultTimeoutMs: 1000,
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
        const result = await bus.request("runSystem", {
          entities: filteredEntities as Entity<any>[],
          ids: filteredEntities.map((e) => entities.indexOf(e)),
          name,
        });
        const { add, update } = result.data;
        updateEntities(
          update.entities as Entity<Components>[],
          update.ids as number[]
        );
        entities.push(...(add as Entity<Components>[]));
      } catch (e) {
        console.error("Error in system loop: registration", registration);
        console.error(`Error in system: name: ${name}`, e);
      }
    }
  };

  return { entities, registrations, bus, update };
};
