import { ChannelMessage, EmitterChannel, MessageBus } from "@mjt-engine/mb";
import { Component } from "../type/Component";
import { EcsBridgeMap } from "./EcsBridgeMap";
import { ManyWindowEmitter } from "./ManyWindowEmitter";

export const EcsBridge = async <Components extends Component[]>(
  props: Partial<Parameters<typeof MessageBus<EcsBridgeMap<Components>>>[0]> &
    Partial<{
      windows: Window[];
      signal: AbortSignal;
    }> = {}
) => {
  const { windows = [window], signal, ...rest } = props;
  const emitter = ManyWindowEmitter<ChannelMessage<Uint8Array>>(windows);
  // const emitter = new EventEmitter();

  const channel = EmitterChannel<Uint8Array>(emitter);
  signal?.addEventListener("abort", () => {
    emitter.removeAllListeners();
  });
  const bus = await MessageBus<EcsBridgeMap<Components>>({ channel, ...rest });
  return {
    bus,
    emitter,
    channel,
  } as const;
};
