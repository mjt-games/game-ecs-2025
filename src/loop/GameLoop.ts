import { Animates } from "@mjt-engine/animate";
import { Asserts } from "@mjt-engine/assert";
import { QuerySystem } from "./QuerySystem";
import { isDefined } from "@mjt-engine/object";
import { Component } from "../type/Component";
import { Entity } from "../type/Entity";
import { queryFilter } from "../common/queryFilter";

export const GameLoop = <Components extends Component[]>({
  entities = [],
  querySystems = [],
}: {
  entities?: Entity<Components>[];
  querySystems?: QuerySystem<any>[];
} = {}) => {
  const animation = () => {
    for (const querySystem of querySystems) {
      const { query, system } = querySystem;
      const filteredEntities = !query
        ? entities
        : queryFilter<any>(query)(entities);
      const result = system(
        filteredEntities,
        filteredEntities.map((e) => entities.indexOf(e))
      );
      if (result) {
        if (Array.isArray(result)) {
          entities.push(...result);
        } else {
          entities.push(result);
        }
      }
    }
  };
  let paused = false;
  const pause = () => {
    paused = true;
  };
  const resume = () => {
    paused = false;
  };
  const loop = () => {
    if (!paused) {
      animation();
    }
    // requestAnimationFrame(loop);
  };
  const start = () => {
    paused = false;
    // requestAnimationFrame(loop);
  };
  const state = Animates.create({
    // ticksPerSecond: 1,
    ticker: () => {
      if (!paused) {
        animation();
      }
    },
  });
  const addQuerySystem = (querySystem: QuerySystem<any>) => {
    querySystems.push(querySystem);
  };
  const addEntity = (entity: Entity<Components>) => {
    Asserts.assertValue(entity, `illegal undefined entity!`);
    entities.push(entity);
  };
  const addEntities = (values: Entity<Components>[]) => {
    entities.push(...values.filter(isDefined));
  };
  const updateEntity = (id: number, entity: Entity<Components>) => {
    Asserts.assertValue(entities[id], `Entity with id ${id} not found`);
    Asserts.assertValue(entity, `illegal undefined entity!`);
    entities[id] = entity;
  };

  const getEntities = () => {
    return entities;
  };
  const setEntities = (values: Entity<Components>[]) => {
    entities.length = 0;
    entities.push(...values.filter(isDefined));
  };

  return {
    entities,
    pause,
    resume,
    start,
    addQuerySystem,
    addEntity,
    addEntities,
    updateEntity,
    getEntities,
    setEntities,
  };
};
