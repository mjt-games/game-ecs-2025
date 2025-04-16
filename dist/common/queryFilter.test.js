import { describe, expect, test } from "vitest";
import { LazyObjects } from "./LazyObjects";
import { queryFilter } from "./queryFilter";
describe("filterEntities", () => {
    const lazy = LazyObjects();
    const testEntity1 = lazy.from({
        core: { id: 1, tags: ["foo"] },
        world: { position: { x: -1, y: 2 } },
        stats: { health: 100 },
        char: { name: "Alice" },
    });
    const testEntity2 = lazy.from({
        core: { id: 2, tags: ["foo", "bar"] },
        world: { position: { x: 0, y: 2, z: 3 } },
        stats: { health: 18 },
        char: { name: "Bob" },
    });
    const testEntity3 = lazy.from({
        core: { id: 3, tags: ["bar"] },
        stats: { health: 5 },
        char: { name: "Carol" },
    });
    const entities = [testEntity1, testEntity2, testEntity3];
    lazy.setSuppressLazy(true);
    test("match", () => {
        const query = {
            match: { key: "core.id", value: 1 },
        };
        const filtered = queryFilter(query)(entities);
        expect(filtered.length).toBe(1);
        expect(filtered[0].core.id).toBe(1);
    });
    test("contains", () => {
        const query = {
            match: { key: "core.tags", op: "contains", value: "foo" },
        };
        const filtered = queryFilter(query)(entities);
        expect(filtered.length).toBe(2);
        expect(filtered.map((f) => f.core.id)).toEqual([1, 2]);
    });
    test("regex", () => {
        const query = {
            match: { key: "char.name", op: "ri", value: "O" },
        };
        const filtered = queryFilter(query)(entities);
        expect(filtered.length).toBe(2);
        expect(filtered.map((f) => f.core.id)).toEqual([2, 3]);
    });
    test("has", () => {
        const query = {
            has: ["world.position"],
        };
        const filtered = queryFilter(query)(entities);
        expect(filtered.length).toBe(2);
        expect(filtered.map((f) => f.core.id)).toEqual([1, 2]);
    });
    test("not", () => {
        const query = {
            not: ["world.position"],
        };
        const filtered = queryFilter(query)(entities);
        expect(filtered.length).toBe(1);
        expect(filtered.map((f) => f.core.id)).toEqual([3]);
    });
    test("and", () => {
        const query = {
            has: ["world.position"],
            match: { key: "stats.health", value: 100 },
        };
        const filtered = queryFilter(query)(entities);
        expect(filtered.length).toBe(1);
        expect(filtered.map((f) => f.core.id)).toEqual([1]);
    });
    test("or", () => {
        const query = {
            match: { key: "stats.health", value: 18 },
            or: { match: { key: "stats.health", value: 5 } },
        };
        const filtered = queryFilter(query)(entities);
        expect(filtered.length).toBe(2);
        expect(filtered.map((f) => f.core.id)).toEqual([2, 3]);
    });
});
//# sourceMappingURL=queryFilter.test.js.map