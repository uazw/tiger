import { StateManager, State, Server } from "./types";
export declare class DefaultStateManager implements StateManager {
    state: State;
    set(key: string, value: State): State;
    get(key: string): State;
    mount(server: Server): void;
}
