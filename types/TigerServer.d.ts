import { Tiger, StateManager, ModuleRegistry } from "./types";
import express = require("express");
export default class TigerServer implements Tiger {
    server: express.Express;
    moduleRegistry: ModuleRegistry;
    serverPort?: number;
    stateManager: StateManager;
    constructor();
    serve(basePath: string): void;
    config(configurer: (express: express.Express) => void): void;
    port(port: number): void;
    private state;
    private loadModules;
}
