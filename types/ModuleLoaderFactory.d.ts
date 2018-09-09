/// <reference types="express" />
import { StateManager, LoaderConfig, LoaderResult } from "./types";
import { DefaultModuleRegistry } from "./ModuleRegistry";
declare const _default: (stm: StateManager, cfg: LoaderConfig, registry: DefaultModuleRegistry, server: import("express").Express) => (module: string, force?: boolean) => LoaderResult;
export default _default;
