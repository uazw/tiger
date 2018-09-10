import * as express from "express";
import { ScheduledTask } from "node-cron";
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
    _worker?: ScheduledTask;
}
export declare type ModuleDef = TigerModuleDef | PullModuleDef;
export interface Tiger {
    serve(basePath: string): void;
    config(configurer: (server: Server) => void): void;
    port(port: number): void;
}
export declare type StateManager = (key: string, value?: State) => State;
export interface TigerModule {
    name: string;
    moduleDef: ModuleDef;
}
export interface ModuleRegistry {
    update(module: string, moduleDef: ModuleDef): TigerModule;
    unload(module: string): TigerModule;
    valid(module: string): boolean;
    retrieve(module: string): TigerModule;
}
export declare type ModuleLoader = (module: string, force?: boolean) => LoaderResult;
export interface LoaderConfig {
    basePath: string;
}
export declare type LoaderResult = {
    status: boolean;
    path: string;
};
export declare function isTigerModuleDef(moduleDef: TigerModuleDef | PullModuleDef): moduleDef is TigerModuleDef;
