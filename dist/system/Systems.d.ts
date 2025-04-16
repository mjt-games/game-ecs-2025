import { Component } from "../type/Component";
import { Entity } from "../type/Entity";
import { Query } from "../type/Query";
export type System<Components extends Component[]> = (entities: Entity<Components>[]) => Entity<Components>[] | void | null | undefined;
export type CoreRegisterSystemMessage<Components extends Component[]> = Component<"core", "registerSystem", {
    name: string;
    query: Query<Components>;
}>;
export type CoreRunSystemMessage<Components extends Component[]> = Component<"core", "runSystem", {
    name: string;
    entities: Entity<Components>[];
}>;
export declare const Systems: () => {
    addSystem: <Components extends Component[]>(system: System<Components>) => void;
    systems: System<any>[];
};
