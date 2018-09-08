import express = require("express");
export declare type State = {
    [key: string]: State | any;
};
export declare type TigerMethod = "get" | "put" | "post" | "delete" | "options" | "head" | "patch" | "all";
export interface TigerModule {
    method: TigerMethod;
    state?: State;
    handler: (req: express.Request, res: express.Response, state?: State) => boolean;
}
export interface Tiger {
    serve(basePath: string): void;
    config(configurer: (express: express.Express) => void): void;
    port(port: number): void;
}
