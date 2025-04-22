import { Component } from "../type/Component";
import { Query } from "../type/Query";
import { System } from "../type/System";
import { EcsBridgeMessageBus } from "./EcsBridgeMessageBus";
export declare const Systems: <Components extends Component[]>(bus: Awaited<ReturnType<typeof EcsBridgeMessageBus<Components>>>) => {
    register: ({ name, query, system, }: {
        name?: string;
        query?: Query<Components>;
        system: System<Components>;
    }) => Promise<string>;
};
