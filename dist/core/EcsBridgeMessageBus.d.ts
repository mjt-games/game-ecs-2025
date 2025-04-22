import { MessageBus } from "@mjt-engine/mb";
import { Component } from "../type/Component";
import { EcsBridgeMap } from "./EcsBridgeMap";
export declare const EcsBridgeMessageBus: <Components extends Component[]>(props?: Partial<Parameters<typeof MessageBus<EcsBridgeMap<Components>>>[0]> & Partial<{
    localWindow: Window;
    remoteWindow: Window;
    signal: AbortSignal;
}>) => Promise<import("@mjt-engine/mb").MbClient<EcsBridgeMap<Components>>>;
