import { Emitter } from "@mjt-engine/mb";
export declare const LocalRemoteWindowEmitter: <T>(local: Window, remote: Window) => Emitter<T> & {
    close: () => void;
};
