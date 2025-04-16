declare const DirtySymbol: unique symbol;
export declare const LazyObjects: <T extends object>() => {
    isDirty: (obj: any) => boolean;
    from: (obj?: Partial<T>) => T & {
        [DirtySymbol]: boolean;
    };
    setSuppressDirty: (suppress: boolean) => void;
    setSuppressLazy: (suppress: boolean) => void;
    toPlain: <T_1 extends object>(obj: T_1 & {
        [DirtySymbol]: boolean;
    }) => T_1;
};
export {};
