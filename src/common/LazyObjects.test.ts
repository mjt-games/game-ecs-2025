import { describe, expect, test } from "vitest";
import { LazyObjects } from "./LazyObjects";
import { Component } from "../type/Component";
import { Entity } from "../type/Entity";

describe("LazyObjects", () => {
  type IdComponent = Component<"core", "id", number>;

  type PositionComponent = Component<
    "world",
    "position",
    { x: number; y: number; z?: number }
  >;
  type HealthComponent = Component<"stats", "health", number>;
  type TagsComponent = Component<"core", "tags", string[]>;

  type MyEntity = Entity<
    [IdComponent, PositionComponent, HealthComponent, TagsComponent]
  >;
  const lazy = LazyObjects();

  test("from empty", () => {
    const testEntity: MyEntity = lazy.from<MyEntity>();

    testEntity.core.id = 1;

    testEntity.world.position = {
      x: 1,
      y: 2,
    };
    expect(testEntity.world.position).toEqual({
      x: 1,
      y: 2,
      z: undefined,
    });
  });

  test("dirty", () => {
    const testEntity: MyEntity = lazy.from<MyEntity>();

    expect(lazy.isDirty(testEntity)).toBe(false);
    testEntity.core.id = 1;
    const foo = testEntity.core.id;
    expect(lazy.isDirty(testEntity)).toBe(true);
  });
  test("keys", () => {
    const testEntity: MyEntity = lazy.from<MyEntity>();
    testEntity.core.id = 1;
    testEntity.world.position = {
      x: 1,
      y: 2,
    };
    const keys = Object.keys(testEntity);
    expect(keys).toEqual(["core", "world"]);
  });
  test("stringify", () => {
    const testEntity: MyEntity = lazy.from<MyEntity>();
    testEntity.core.id = 1;
    testEntity.world.position = {
      x: 1,
      y: 2,
    };
    const stringified = JSON.stringify(testEntity);
    expect(stringified).toBe(
      '{"core":{"id":1},"world":{"position":{"x":1,"y":2}}}'
    );
  });
  test("arrays", () => {
    const testEntity: MyEntity = lazy.from<MyEntity>();
    testEntity.core.tags = ["tag1", "tag2"];
    expect(testEntity.core.tags).toEqual(["tag1", "tag2"]);
  });
  test("from existing", () => {
    const testEntity: MyEntity = lazy.from<MyEntity>({
      core: {
        id: 1,
        tags: ["tag1", "tag2"],
      },
    });
    expect(lazy.isDirty(testEntity)).toBe(false);
    expect(testEntity.core.tags).toEqual(["tag1", "tag2"]);
  });
});
