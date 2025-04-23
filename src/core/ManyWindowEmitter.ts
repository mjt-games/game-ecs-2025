import { Emitter } from "@mjt-engine/mb";

export const ManyWindowEmitter = <T>(
  windows: Window[]
): Emitter<T> & {
  removeAllListeners: () => void;
  addWindow: (window: Window) => void;
  removeWindow: (window: Window) => void;
} => {
  const listeners = new WeakMap<
    (...args: any[]) => void,
    (e: MessageEvent) => void
  >();
  const abortController = new AbortController();
  return {
    removeAllListeners: () => {
      abortController.abort();
    },
    addWindow: (window: Window) => {
      windows.push(window);
    },
    removeWindow: (window: Window) => {
      const index = windows.indexOf(window);
      if (index !== -1) {
        windows.splice(index, 1);
      }
    },
    emit: (selector: string, ...args: any[]) => {
      for (const w of windows) {
        w.postMessage({ selector, payload: args[0] }, "*");
      }
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
      for (const w of windows) {
        w.addEventListener("message", listener, {
          signal: abortController.signal,
        });
      }
    },
    off: (selector: string, callback: (...args: any[]) => void) => {
      const listener = listeners.get(callback);
      for (const w of windows) {
        w.removeEventListener("message", listener as EventListener);
      }
    },
  };
};
