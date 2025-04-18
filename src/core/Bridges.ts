import { Component } from "../type/Component";
import { Entity } from "../type/Entity";
import { Query } from "../type/Query";

export type BridgeMessageTypeMap<Components extends Component[]> = {
  init: void;
  add: Entity<Components>[];
  update: { entities: Entity<Components>[]; ids: number[] };
  error: string;
  registerQuery: { name: string; query?: Query<Components> };
  runSystem: { name: string; entities: Entity<Components>[]; ids: number[] };
  log: string;
};

export type BridgeMessageEvent<
  Components extends Component[],
  EventType extends keyof BridgeMessageTypeMap<Components>
> = {
  type: EventType;
  payload: BridgeMessageTypeMap<Components>[EventType];
};

export const Bridges = <Components extends Component[]>({
  postCtx = window.parent,
  listenCtx = window,
}: {
  postCtx?: Window;
  listenCtx?: Window;
} = {}) => {
  type MessageEventListener<
    EventType extends keyof BridgeMessageTypeMap<Components>
  > = (event: BridgeMessageEvent<Components, EventType>) => void;

  const listeners = new Map<
    keyof BridgeMessageTypeMap<Components>,
    MessageEventListener<any>
  >();

  const post = <EventType extends keyof BridgeMessageTypeMap<Components>>(
    event: BridgeMessageEvent<Components, EventType>
  ) => {
    postCtx.postMessage(event, "*");
  };

  const abortController = new AbortController();

  // initialize the main listener
  {
    listenCtx.addEventListener(
      "message",
      (e) => {
        try {
          const { type, payload } = e.data as BridgeMessageEvent<
            Components,
            keyof BridgeMessageTypeMap<Components>
          >;
          const listener = listeners.get(type);
          if (!listener) {
            return;
          }
          return listener({ type, payload });
        } catch (err) {
          console.error(err);
        }
      },
      {
        signal: abortController.signal,
      }
    );
  }

  const addListener = <
    EventType extends keyof BridgeMessageTypeMap<Components>
  >({
    eventType,
    listener,
  }: {
    eventType: EventType;
    listener: MessageEventListener<EventType>;
  }) => {
    listeners.set(eventType, listener);
    return () => {
      listeners.delete(eventType);
    };
  };
  return {
    post,
    addListener,
    dispose: () => {
      abortController.abort();
    },
  };
};
