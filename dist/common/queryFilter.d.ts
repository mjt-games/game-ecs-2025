import { Query } from "../type/Query";
import { Component } from "../type/Component";
import { Entity } from "../type/Entity";
export declare const queryFilter: <Components extends Component[]>(query: Query<Components>) => (entities: Entity<Components>[]) => Entity<Components>[];
