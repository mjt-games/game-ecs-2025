import { describe, expect, test } from "vitest";
import { Component } from "../type/Component";
import { Entity } from "../type/Entity";
import { LazyObjects } from "./LazyObjects";
import { Query } from "../type/Query";
import { queryFilter } from "./queryFilter";

describe("filterEntities", () => {
  type IdComponent = Component<"core", "id", number>;

  type PositionComponent = Component<
    "world",
    "position",
    { x: number; y: number; z?: number }
  >;
  type HealthComponent = Component<"stats", "health", number>;
  type NameComponent = Component<"char", "name", string>;
  type TagsComponent = Component<"core", "tags", string[]>;

  type MyEntity = Entity<
    [
      IdComponent,
      PositionComponent,
      HealthComponent,
      TagsComponent,
      NameComponent
    ]
  >;
  const lazy = LazyObjects();
  const testEntity1 = lazy.from<MyEntity>({
    core: { id: 1, tags: ["foo"] },
    world: { position: { x: -1, y: 2 } },
    stats: { health: 100 },
    char: { name: "Alice" },
  });
  const testEntity2 = lazy.from<MyEntity>({
    core: { id: 2, tags: ["foo", "bar"] },
    world: { position: { x: 0, y: 2, z: 3 } },
    stats: { health: 18 },
    char: { name: "Bob" },
  });
  const testEntity3 = lazy.from<MyEntity>({
    core: { id: 3, tags: ["bar"] },
    stats: { health: 5 },
    char: { name: "Carol" },
  });
  const entities = [testEntity1, testEntity2, testEntity3];

  lazy.setSuppressLazy(true);
  test("match", () => {
    const query: Query<
      [IdComponent, PositionComponent | TagsComponent, HealthComponent]
    > = {
      match: { key: "core.id", value: 1 },
    };
    const filtered = queryFilter(query)(entities);
    expect(filtered.length).toBe(1);
    expect(filtered[0].core.id).toBe(1);
  });
  test("contains", () => {
    const query: Query<
      [
        IdComponent,
        PositionComponent | TagsComponent,
        HealthComponent | NameComponent
      ]
    > = {
      match: { key: "core.tags", op: "contains", value: "foo" },
    };
    const filtered = queryFilter(query)(entities);
    expect(filtered.length).toBe(2);
    expect(filtered.map((f) => f.core.id)).toEqual([1, 2]);
  });
  test("regex", () => {
    const query: Query<
      [
        IdComponent,
        PositionComponent | TagsComponent,
        HealthComponent | NameComponent
      ]
    > = {
      match: { key: "char.name", op: "ri", value: "O" },
    };
    const filtered = queryFilter(query)(entities);
    expect(filtered.length).toBe(2);
    expect(filtered.map((f) => f.core.id)).toEqual([2, 3]);
  });
  test("has", () => {
    const query: Query<
      [IdComponent, PositionComponent | TagsComponent, HealthComponent]
    > = {
      has: ["world.position"],
    };
    const filtered =
      queryFilter<
        [IdComponent, PositionComponent | TagsComponent, HealthComponent]
      >(query)(entities);
    expect(filtered.length).toBe(2);
    expect(filtered.map((f) => f.core.id)).toEqual([1, 2]);
  });
  test("not", () => {
    const query: Query<
      [IdComponent, PositionComponent | TagsComponent, HealthComponent]
    > = {
      not: ["world.position"],
    };
    const filtered =
      queryFilter<
        [IdComponent, PositionComponent | TagsComponent, HealthComponent]
      >(query)(entities);
    expect(filtered.length).toBe(1);
    expect(filtered.map((f) => f.core.id)).toEqual([3]);
  });
  test("and", () => {
    const query: Query<
      [IdComponent, PositionComponent | TagsComponent, HealthComponent]
    > = {
      has: ["world.position"],
      match: { key: "stats.health", value: 100 },
    };
    const filtered =
      queryFilter<
        [IdComponent, PositionComponent | TagsComponent, HealthComponent]
      >(query)(entities);
    expect(filtered.length).toBe(1);
    expect(filtered.map((f) => f.core.id)).toEqual([1]);
  });
  test("or", () => {
    const query: Query<
      [IdComponent, PositionComponent | TagsComponent, HealthComponent]
    > = {
      match: { key: "stats.health", value: 18 },
      or: { match: { key: "stats.health", value: 5 } },
    };
    const filtered =
      queryFilter<
        [IdComponent, PositionComponent | TagsComponent, HealthComponent]
      >(query)(entities);
    expect(filtered.length).toBe(2);
    expect(filtered.map((f) => f.core.id)).toEqual([2, 3]);
  });
});
