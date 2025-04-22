import { Component, Query, System } from "@mjt-games/game-ecs-2025";


export type QuerySystem<Components extends Component[]> = {
  query?: Query<Components>;
  system: System<any>;
};
