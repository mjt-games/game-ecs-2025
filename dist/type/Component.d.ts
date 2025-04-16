export type Component<N extends string = string, K extends string = string, V = unknown> = {
    [key in N]: {
        [key in K]: V;
    };
};
