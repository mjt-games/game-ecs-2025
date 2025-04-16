const DirtySymbol = Symbol("dirty");

export const LazyObjects = () => {
  let suppressDirty = false;
  let suppressLazy = false;
  type LazyObjectType = "array" | "object";
  type LazyObject<T> = T & {
    [DirtySymbol]: boolean;
  };

  const createLazyObject = <T extends object>(
    type: LazyObjectType = "object"
  ): LazyObject<T> => {
    const root: any = type == "object" ? {} : [];
    Object.defineProperty(root, DirtySymbol, {
      value: false,
      writable: true,
      enumerable: false,
      configurable: false,
    });

    return new Proxy(root, {
      get(target, prop, receiver) {
        if (prop === DirtySymbol) {
          return target[DirtySymbol];
        }

        if (prop === "toJSON") {
          return function () {
            const out: any = {};
            for (const key of Object.keys(target)) {
              const val = target[key];
              if (
                val &&
                typeof val === "object" &&
                typeof val.toJSON === "function"
              ) {
                out[key] = val.toJSON();
              } else {
                out[key] = val;
              }
            }
            return out;
          };
        }
        if (prop === Symbol.toStringTag) {
          return undefined;
        }

        if (!(prop in target) && !suppressLazy) {
          target[prop] = createLazyObject();
        }

        return Reflect.get(target, prop, receiver);
      },

      set(target, prop, value, receiver) {
        if (prop !== DirtySymbol && !suppressDirty) {
          target[DirtySymbol] = true;
        }
        return Reflect.set(target, prop, value, receiver);
      },

      has(target, prop) {
        // Avoid triggering lazy init during `prop in obj`
        return Reflect.has(target, prop);
      },

      ownKeys(target) {
        // Prevent keys from being listed unless explicitly created
        return Reflect.ownKeys(target);
      },

      getOwnPropertyDescriptor(target, prop) {
        return Object.getOwnPropertyDescriptor(target, prop);
      },
    });
  };

  const isDirty = (obj: any): boolean => {
    if (obj[DirtySymbol]) {
      return obj[DirtySymbol];
    }
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === "object") {
        return isDirty(obj[key]);
      }
    }
    return false;
  };

  const wrapLazyObject = <T extends object>(obj: Partial<T>): LazyObject<T> => {
    const type = Array.isArray(obj) ? "array" : "object";
    const lazy: any = createLazyObject<T>(type);

    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) {
        continue;
      }
      if (value === null) {
        lazy[key] = null;
        continue;
      }
      lazy[key] =
        typeof value === "object" ? wrapLazyObject(value as any) : value;
    }

    return lazy;
  };
  const from = <T extends object>(obj?: Partial<T>): LazyObject<T> => {
    if (obj === undefined) {
      return createLazyObject<T>();
    }
    suppressDirty = true;
    const lazy = wrapLazyObject(obj);
    suppressDirty = false;
    return lazy;
  };
  const setSuppressDirty = (suppress: boolean) => {
    suppressDirty = suppress;
  };
  const setSuppressLazy = (suppress: boolean) => {
    suppressLazy = suppress;
  };

  const toPlain = <T extends object>(obj: LazyObject<T>): T => {
    return JSON.parse(JSON.stringify(obj));
  };
  return {
    isDirty,
    from,
    setSuppressDirty,
    setSuppressLazy,
    toPlain,
  };
};
