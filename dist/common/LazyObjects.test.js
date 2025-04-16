import { describe, expect, test } from "vitest";
import { LazyObjects } from "./LazyObjects";
describe("LazyObjects", () => {
    const lazy = LazyObjects();
    test("from empty", () => {
        const testEntity = lazy.from();
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
        const testEntity = lazy.from();
        expect(lazy.isDirty(testEntity)).toBe(false);
        testEntity.core.id = 1;
        const foo = testEntity.core.id;
        expect(lazy.isDirty(testEntity)).toBe(true);
    });
    test("keys", () => {
        const testEntity = lazy.from();
        testEntity.core.id = 1;
        testEntity.world.position = {
            x: 1,
            y: 2,
        };
        const keys = Object.keys(testEntity);
        expect(keys).toEqual(["core", "world"]);
    });
    test("stringify", () => {
        const testEntity = lazy.from();
        testEntity.core.id = 1;
        testEntity.world.position = {
            x: 1,
            y: 2,
        };
        const stringified = JSON.stringify(testEntity);
        expect(stringified).toBe('{"core":{"id":1},"world":{"position":{"x":1,"y":2}}}');
    });
    test("arrays", () => {
        const testEntity = lazy.from();
        testEntity.core.tags = ["tag1", "tag2"];
        expect(testEntity.core.tags).toEqual(["tag1", "tag2"]);
    });
    test("from existing", () => {
        const testEntity = lazy.from({
            core: {
                id: 1,
                tags: ["tag1", "tag2"],
            },
        });
        expect(lazy.isDirty(testEntity)).toBe(false);
        expect(testEntity.core.tags).toEqual(["tag1", "tag2"]);
    });
});
//# sourceMappingURL=LazyObjects.test.js.map