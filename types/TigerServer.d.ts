import { Tiger, TigerModule, State } from "./types";
import express = require("express");
export default class TigerServer implements Tiger {
    server: express.Express;
    triggers: {
        [key: string]: TigerModule;
    };
    db: {
        [key: string]: State;
    };
    serverPort?: number;
    constructor();
    serve(basePath: string): void;
    config(configurer: (express: express.Express) => void): void;
    port(port: number): void;
    private state;
    private loadModules;
}
