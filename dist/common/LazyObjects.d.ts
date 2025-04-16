declare const DirtySymbol: unique symbol;
export declare const LazyObjects: () => {
    isDirty: (obj: any) => boolean;
    from: <T extends object>(obj?: Partial<T>) => T & {
        [DirtySymbol]: boolean;
    };
    setSuppressDirty: (suppress: boolean) => void;
    setSuppressLazy: (suppress: boolean) => void;
    toPlain: <T extends object>(obj: T & {
        [DirtySymbol]: boolean;
    }) => T;
};
export {};
