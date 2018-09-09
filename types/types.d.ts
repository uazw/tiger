import * as express from "express";
export declare type State = {
    [key: string]: State | any;
};
export declare type TigerMethod = "get" | "put" | "post" | "delete" | "options" | "head" | "patch" | "all";
export declare type Server = express.Express;
export declare type Request = express.Request;
export declare type Response = express.Response;
export interface TigerModuleDef {
    method: TigerMethod;
    state?: State;
    handler: (req: Request, res: Response, state?: State) => boolean;
}
export interface PullModuleDef {
    cron: string;
    state?: State;
    handler: (state?: State) => void;
}
export interface Tiger {
    serve(basePath: string): void;
    config(configurer: (server: Server) => void): void;
    port(port: number): void;
}
export declare type StateManager = (key: string, value?: State) => State;
export interface TigerModule<T> {
    name: string;
    moduleDef: T;
}
export interface ModuleRegistry<T> {
    update(module: string, moduleDef: T): TigerModule<T>;
    unload(module: string): TigerModule<T>;
    valid(module: string): boolean;
    retrieve(module: string): TigerModule<T>;
}
export declare type ModuleLoader = (module: string, force?: boolean) => LoaderResult;
export interface LoaderConfig {
    basePath: string;
}
export declare type LoaderResult = {
    status: boolean;
    path: string;
};
