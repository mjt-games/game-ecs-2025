import { ErrorDetail } from "@mjt-engine/error";
import { Component } from "../type/Component";
import { Entity } from "../type/Entity";
import { Query } from "../type/Query";
import { SatisfiesConnectionMap } from "./SatisfiesConnectionMap";
export type EcsBridgeMap<Components extends Component[]> = SatisfiesConnectionMap<{
    add: {
        request: Entity<Components>;
        response: void;
    };
    update: {
        request: {
            entities: Entity<Components>[];
            ids: number[];
        };
        response: void;
    };
    search: {
        request: Query<Components>;
        response: Entity<Components>[];
    };
    error: {
        request: ErrorDetail;
        response: void;
    };
    registerQuery: {
        request: {
            name: string;
            query?: Query<Components>;
        };
        response: void;
    };
    runSystem: {
        request: {
            name: string;
            entities: Entity<Components>[];
            ids: number[];
        };
        response: {
            update: {
                entities: Entity<Components>[];
                ids: number[];
            };
            add: Entity<Components>[];
        };
    };
    log: {
        request: string;
        response: void;
    };
    ask: {
        request: string;
        response: string;
        headers: {
            systemMessage: string;
        };
    };
    genImage: {
        request: string;
        response: string;
        headers: {
            negativePrompt: string;
            steps: string;
            width: string;
            height: string;
            seed: string;
        };
    };
}>;
