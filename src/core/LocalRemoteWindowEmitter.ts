import { Emitter } from "@mjt-engine/mb";

export const LocalRemoteWindowEmitter = <T>(
  local: Window,
  remote: Window
): Emitter<T> => {
  const listeners = new WeakMap<
    (...args: any[]) => void,
    (e: MessageEvent) => void
  >();
  const abortController = new AbortController();
  return {
    removeAllListeners: () => {
      abortController.abort();
    },
    emit: (selector: string, ...args: any[]) => {
      remote.postMessage({ selector, payload: args[0] }, "*");
    },
    on: (selector: string, callback: (...args: any[]) => void) => {
      const listener = async (e: MessageEvent) => {
        const { selector: s, payload } = e.data as {
          selector: string;
          payload: any;
        };
        if (s !== selector) {
          return;
        }
        return callback(payload);
      };
      listeners.set(callback, listener);
      local.addEventListener("message", listener, {
        signal: abortController.signal,
      });
    },
    off: (selector: string, callback: (...args: any[]) => void) => {
      const listener = listeners.get(callback);
      local.removeEventListener("message", listener as EventListener);
    },
  };
};
