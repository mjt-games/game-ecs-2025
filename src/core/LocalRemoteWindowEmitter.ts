import { Emitter } from "@mjt-engine/mb";

export const LocalRemoteWindowEmitter = <T>(
  local: Window,
  remote: Window
): Emitter<T> & { close: () => void } => {
  const listeners = new WeakMap<
    (...args: any[]) => void,
    (e: MessageEvent) => void
  >();
  const abortController = new AbortController();
  return {
    close: () => {
      abortController.abort();
    },
    emit: (event: string, ...args: any[]) => {
      remote.postMessage(args[0]);
    },
    on: (event: string, callback: (...args: any[]) => void) => {
      const listener = async (e: MessageEvent) => {
        return callback(e.data);
      };
      listeners.set(callback, listener);
      local.addEventListener("message", listener, {
        signal: abortController.signal,
      });
    },
    off: (event: string, callback: (...args: any[]) => void) => {
      const listener = listeners.get(callback);
      local.removeEventListener("message", listener as EventListener);
    },
  };
};
