import { CtxMapper, Tests } from "@mjt-engine/test";
import { EcsBridge } from "./EcsBridge";

type CtxObject = Awaited<ReturnType<typeof EcsBridge>>;
const ctxMapper: CtxMapper<CtxObject> = async (test) => {
  const abortController = new AbortController();
  const ecs = await EcsBridge({
    signal: abortController.signal,
    // subscribers: {
    //   log: (message) => {
    //     console.log("Log message:", message);
    //   },
    // },
  });

  try {
    await test(ecs);
    abortController.abort();
  } finally {
  }
};
export const testEcsBridgeMessageBus = async () => {
  const { describe, test, runTests, expect, printResultsPretty } = Tests({
    ctxMapper,
    defaultTimeoutMs: 1000,
  });

  describe("EcsBridgeMessageBus", () => {
    test("Basic test", async (ecs) => {
      expect(ecs).toBeDefined();
    });

    test("adding subscribers", async (ecs) => {
      let result = "waiting...";
      ecs.bus.subscribe("log", async (message) => {
        console.log("Log message:", message);
        result = message;
      });
      await ecs.bus.publish("log", "Hello, world!");

      expect(result).toEqual("waiting...");
      // expect to wait for the log message to be printed on next event loop
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(result).toEqual("Hello, world!");
    });
  });
  await runTests();
  printResultsPretty();
};
