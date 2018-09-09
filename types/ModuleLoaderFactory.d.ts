/// <reference types="express" />
import { StateManager, LoaderConfig, LoaderResult } from "./types";
declare const _default: (stm: StateManager, cfg: LoaderConfig, registries: [import("./ModuleRegistry").DefaultModuleRegistry, import("./ModuleRegistry").PullModuleRegistry], server: import("express").Express) => (module: string, force?: boolean) => LoaderResult;
export default _default;
