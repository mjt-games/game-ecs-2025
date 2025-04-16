const DirtySymbol = Symbol("dirty");
export const LazyObjects = () => {
    let suppressDirty = false;
    let suppressLazy = false;
    const createLazyObject = (type = "object") => {
        const root = type == "object" ? {} : [];
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
                        const out = {};
                        for (const key of Object.keys(target)) {
                            const val = target[key];
                            if (val &&
                                typeof val === "object" &&
                                typeof val.toJSON === "function") {
                                out[key] = val.toJSON();
                            }
                            else {
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
    const isDirty = (obj) => {
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
    const wrapLazyObject = (obj) => {
        const type = Array.isArray(obj) ? "array" : "object";
        const lazy = createLazyObject(type);
        for (const [key, value] of Object.entries(obj)) {
            if (value === undefined) {
                continue;
            }
            if (value === null) {
                lazy[key] = null;
                continue;
            }
            lazy[key] =
                typeof value === "object" ? wrapLazyObject(value) : value;
        }
        return lazy;
    };
    const from = (obj) => {
        if (obj === undefined) {
            return createLazyObject();
        }
        suppressDirty = true;
        const lazy = wrapLazyObject(obj);
        suppressDirty = false;
        return lazy;
    };
    const setSuppressDirty = (suppress) => {
        suppressDirty = suppress;
    };
    const setSuppressLazy = (suppress) => {
        suppressLazy = suppress;
    };
    const toPlain = (obj) => {
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
//# sourceMappingURL=LazyObjects.js.map