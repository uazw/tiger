
import * as express from "express";
import { DefaultModuleRegistry } from "./ModuleRegistry";

export type State = { [key: string]: State | any };

export type TigerMethod = "get" | "put" | "post" | "delete" | "options" | "head" | "patch" | "all";

export type Server = express.Express;
export type Request = express.Request;
export type Response = express.Response;

export interface TigerModuleDef {
  method: TigerMethod,
  state?: State,
  handler: (req: Request, res: Response, state?: State) => boolean
}

export interface PullModuleDef {
  cron: string,
  state?: State,
  handler: (state?: State) => void
}

export interface Tiger {
  serve(basePath: string): void
  config(configurer: (server: Server) => void): void
  port(port: number): void
}

export type StateManager = (key: string, value?: State) => State

export interface TigerModule<T> {
  name: string,
  moduleDef: T;
}

export interface ModuleRegistry<T> {
  update(module: string, moduleDef: T): TigerModule<T>;
  unload(module: string): TigerModule<T>;
  valid(module: string): boolean;
  retrieve(module: string): TigerModule<T>;
}

export type ModuleLoader = (module: string, force?: boolean) => LoaderResult;

export interface LoaderConfig {
  basePath: string
}

export type LoaderResult = { status: boolean, path: string }
