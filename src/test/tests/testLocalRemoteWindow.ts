import { ChannelMessage, EmitterChannel } from "@mjt-engine/mb";
import { LocalRemoteWindowEmitter } from "../../core/LocalRemoteWindowEmitter";
import { Tests, CtxMapper } from "@mjt-engine/test";

type StringEmitterChannel = ReturnType<typeof EmitterChannel<string>>;
const ctxMapper: CtxMapper<StringEmitterChannel> = async (test) => {
  const emitter = LocalRemoteWindowEmitter<ChannelMessage<string>>(
    window,
    window
  );
  const channel = EmitterChannel<string>(emitter);
  try {
    await test(channel);
    emitter.close();
  } finally {
  }
};
export const testLocalRemoteWindow = async () => {
  const { describe, test, runTests, expect, printResultsPretty } = Tests({
    ctxMapper,
    defaultTimeoutMs: 1000,
  });

  describe("LocalRemoteWindowEmitter", () => {
    test("Basic test", async (elc) => {
      expect(elc).toBeDefined();
    });
    test("listen/post", async (elc) => {
      const result = await new Promise((resolve) => {
        elc.listenOn("test", {
          callback: (data) => {
            resolve("got:" + data);
          },
        });
        elc.postOn("test", "Hello, world!");
      });
      expect(result).toBe("got:Hello, world!");
    });
    test("regex listen/post", async (elc) => {
      const result = await new Promise((resolve) => {
        elc.listenOn(/t.*/, {
          callback: (data) => {
            resolve("got:" + data);
          },
        });
        elc.postOn("test", "Hello, world!");
      });
      expect(result).toBe("got:Hello, world!");
    });
    test("async itr listen/post", async (elc) => {
      const promise = new Promise(async (resolve) => {
        for await (const data of elc.listenOn("test", {
          callback: (d, meta) => {
            return `transformed:` + d;
          },
        })) {
          if (data === "3") {
            resolve("got:" + data);
          }
          if (data === "transformed:3") {
            resolve("got:" + data);
          }
        }
      });
      elc.postOn("test", "1");
      elc.postOn("test", "2");
      elc.postOn("test", "3");
      expect(await promise).toBe("got:transformed:3");
    });
    test("req/rep", async (elc) => {
      elc.listenOn("test", {
        callback: (data) => {
          return `Hello, ${data}`;
        },
      });
      const resp = await elc.request("test", "123");
      expect(resp).toBe("Hello, 123");
    });
    test("req/rep many", async (elc) => {
      elc.listenOn("test", {
        callback: async function* (data) {
          yield `${data} 1`;
          yield `${data} 2`;
          yield `${data} 3`;
        },
      });
      const results: string[] = [];
      await elc.requestMany("test", "123", {
        callback: (data) => {
          results.push(data);
        },
      });
      expect(results).toEqual(["123 1", "123 2", "123 3"]);
    });
    test("req/rep many on non-iter", async (elc) => {
      elc.listenOn("test", {
        callback: (data) => {
          return `${data} 1`;
        },
      });
      const results: string[] = [];
      await elc.requestMany("test", "123", {
        callback: (data) => {
          console.log("callback", data);
          results.push(data);
        },
      });
      expect(results).toEqual(["123 1"]);
    });
  });
  await runTests();
  printResultsPretty();
};
