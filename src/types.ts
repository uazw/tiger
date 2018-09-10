
import * as express from "express";
import { ScheduledTask } from "node-cron";

export type State = { [key: string]: State | any };

export type TigerMethod = "get" | "put" | "post" | "delete" | "options" | "head" | "patch" | "all";

export type Server = express.Express;
export type Request = express.Request;
export type Response = express.Response;


export type ServerRequestHandler = (req: Request, res: Response) => any;

export interface TriggerDef {
  method: TigerMethod,
  state?: State,
  handler: (req: Request, res: Response, state?: State) => boolean
}

export interface WorkerDef {
  cron: string,
  state?: State,
  handler: (state?: State) => void,
  _worker?: ScheduledTask
}

export type ModuleDef = TriggerDef | WorkerDef;

export interface Tiger {
  serve(basePath: string): void
  config(configurer: (server: Server) => void): void
  port(port: number): void
}

export type StateManager = (key: string, value?: State) => State

export interface TigerModule {
  name: string,
  moduleDef: ModuleDef;
  valid: boolean;
  destroy(): void
}

export interface ModuleRegistry {
  update(module: string, moduleDef: TigerModule): TigerModule;
  unload(module: string): TigerModule;
  valid(module: string): boolean;
  retrieve(module: string): TigerModule;
}

export type ModuleLoader = (module: string, force?: boolean) => LoaderResult;

export interface LoaderConfig {
  basePath: string
}

export type LoaderResult = { status: boolean, module: string }

export function isTigerModuleDef(moduleDef: TriggerDef | WorkerDef): moduleDef is TriggerDef {
  return (<TriggerDef>moduleDef).method !== undefined;
}