import { Tiger, StateManager, ModuleRegistry, ModuleLoader, LoaderConfig } from "./types";
import express = require("express");
export default class TigerServer implements Tiger {
    server: express.Express;
    moduleRegistry: ModuleRegistry;
    serverPort?: number;
    stateManager: StateManager;
    moduleLoader: ModuleLoader;
    loaderConfig: LoaderConfig;
    constructor(basePath: string);
    serve(): void;
    config(configurer: (express: express.Express) => void): void;
    port(port: number): void;
}
