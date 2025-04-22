import { ChannelMessage, EmitterChannel, MessageBus } from "@mjt-engine/mb";
import { Component } from "../type/Component";
import { EcsBridgeMap } from "./EcsBridgeMap";
import { LocalRemoteWindowEmitter } from "./LocalRemoteWindowEmitter";

export const EcsBridgeMessageBus = <Components extends Component[]>(
  props: Partial<Parameters<typeof MessageBus<EcsBridgeMap<Components>>>[0]> &
    Partial<{
      localWindow: Window;
      remoteWindow: Window;
      signal: AbortSignal;
    }> = {}
) => {
  const {
    localWindow = window,
    remoteWindow = window,
    signal,
    ...rest
  } = props;
  const emitter = LocalRemoteWindowEmitter<ChannelMessage<Uint8Array>>(
    localWindow,
    remoteWindow
  );
  // const emitter = new EventEmitter();

  const channel = EmitterChannel<Uint8Array>(emitter);
  signal?.addEventListener("abort", () => {
    // emitter.removeAllListeners();
    emitter.close();
  });
  return MessageBus<EcsBridgeMap<Components>>({ channel, ...rest });
};
