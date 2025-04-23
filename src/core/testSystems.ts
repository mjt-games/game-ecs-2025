import { CtxMapper, Tests } from "@mjt-engine/test";
import { EcsBridge } from "./EcsBridge";
import { Systems } from "./Systems";
import { SystemLoop } from "./SystemLoop";
import { Component } from "../type/Component";
import { Entity } from "../type/Entity";

type NameComponent = Component<"character", "name", number>;

type TestEntity = Entity<[NameComponent]>;

type CtxObject = {
  systems: Awaited<ReturnType<typeof Systems>>;
  bus: Awaited<ReturnType<typeof EcsBridge<[NameComponent]>>>["bus"];
  update: () => Promise<void>;
  entities: TestEntity[];
};
const ctxMapper: CtxMapper<CtxObject> = async (test) => {
  const abortController = new AbortController();
  const entities: TestEntity[] = [];
  const { bridge, update } = await SystemLoop<[]>({
    signal: abortController.signal,
    entities,
  });
  const { bus } = bridge;
  const systems = Systems(bridge);

  try {
    await test({ systems, bus, update, entities });
    abortController.abort();
  } finally {
  }
};
export const testSystems = async () => {
  const { describe, test, runTests, expect, printResultsPretty } = Tests({
    ctxMapper,
    defaultTimeoutMs: 1000,
  });

  describe("Systems", () => {
    test("register system", async ({ systems, bus, update }) => {
      expect(systems).toBeDefined();
      let result = "waiting...";
      const systemName = await systems.register({
        name: "register-system-test",
        system: async (entities) => {
          result = "ran system";
        },
      });
      expect(systemName).toBeDefined();
      await update();
      // wait for the system to run on next event loop
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(result).toEqual("ran system");
    });
    test("add entities", async ({ systems, bus, update, entities }) => {
      expect(systems).toBeDefined();
      let result = "waiting...";
      await systems.register({
        name: "add-entities-test",
        system: async () => {
          result = "ran system";
          return [{ character: { name: "Bob" } }];
        },
      });
      await update();
      expect(result).toEqual("ran system");
      expect(entities.length).toEqual(1);
      expect(entities[0].character.name).toEqual("Bob");
    });
    test("update entities", async ({ systems, bus, update, entities }) => {
      expect(systems).toBeDefined();
      let result = "waiting...";
      await systems.register({
        name: "update-entities-test",
        query: { has: ["character.name"] },
        system: async (existing) => {
          result = "ran system";
          if (existing.length > 0) {
            result = "ran system after 1st update";
            existing[0].character.name = "Alice";
            return;
          }
          return [{ character: { name: "Bob" } }];
        },
      });
      await update();
      expect(result).toEqual("ran system");
      expect(entities.length).toEqual(1);
      expect(entities[0].character.name).toEqual("Bob");
      await update();
      expect(result).toEqual("ran system after 1st update");
      expect(entities.length).toEqual(1);
      expect(entities[0].character.name).toEqual("Alice");
    });
  });
  await runTests();
  printResultsPretty();
};
