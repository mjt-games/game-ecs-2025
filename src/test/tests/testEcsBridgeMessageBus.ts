import { CtxMapper, Tests } from "@mjt-engine/test";
import { EcsBridgeMessageBus } from "../../core/EcsBridgeMessageBus";

type CtxObject = Awaited<ReturnType<typeof EcsBridgeMessageBus>>;
const ctxMapper: CtxMapper<CtxObject> = async (test) => {
  const abortController = new AbortController();
  const bus = await EcsBridgeMessageBus({
    signal: abortController.signal,
    // subscribers: {
    //   log: (message) => {
    //     console.log("Log message:", message);
    //   },
    // },
  });

  try {
    await test(bus);
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
    test("Basic test", async (bus) => {
      expect(bus).toBeDefined();
    });

    test("test adding subscribers", async (bus) => {
      let result = "waiting...";
      bus.subscribe("log", async (message) => {
        console.log("Log message:", message);
        result = message;
      });
      await bus.publish("log", "Hello, world!");

      expect(result).toEqual("waiting...");
      // expect to wait for the log message to be printed on next event loop
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(result).toEqual("Hello, world!");
    });
  });
  await runTests();
  printResultsPretty();
};
