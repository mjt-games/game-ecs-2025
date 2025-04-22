import { Tick } from "@mjt-engine/animate";
import { EcsBridgeMap } from "../../core/EcsBridgeMap";
import { Component } from "../../type/Component";
import { Entity } from "../../type/Entity";
export declare const SystemLoop: <Components extends Component[]>({ signal, entities, registrations, }?: Partial<{
    signal: AbortSignal;
    entities: Entity<Components>[];
    registrations: EcsBridgeMap<Components>["registerQuery"]["request"][];
}>) => Promise<{
    entities: Entity<Components>[];
    registrations: {
        name: string;
        query?: Partial<{
            has: import("../..").StringSelectors<(Components[number] extends infer T ? T extends Components[number] ? T extends any ? (x: T) => any : never : never : never) extends (x: infer I) => any ? I : never> | import("../..").StringSelectors<(Components[number] extends infer T_1 ? T_1 extends Components[number] ? T_1 extends any ? (x: T_1) => any : never : never : never) extends (x: infer I) => any ? I : never>[];
            not: import("../..").StringSelectors<(Components[number] extends infer T_2 ? T_2 extends Components[number] ? T_2 extends any ? (x: T_2) => any : never : never : never) extends (x: infer I) => any ? I : never> | import("../..").StringSelectors<(Components[number] extends infer T_3 ? T_3 extends Components[number] ? T_3 extends any ? (x: T_3) => any : never : never : never) extends (x: infer I) => any ? I : never>[];
            match: {
                key: import("../..").StringSelectors<(Components[number] extends infer T_4 ? T_4 extends Components[number] ? T_4 extends any ? (x: T_4) => any : never : never : never) extends (x: infer I) => any ? I : never>;
                op?: "==" | "ri" | "r" | "!=" | ">" | "<" | ">=" | "<=" | "!" | "contains";
                value?: string | number | boolean | string[] | number[] | boolean[];
            };
            and: Partial</*elided*/ any>;
            or: Partial</*elided*/ any>;
        }> | undefined;
    }[];
    bus: import("@mjt-engine/mb").MbClient<EcsBridgeMap<Component[]>>;
    update: (tick?: Tick) => Promise<void>;
}>;
