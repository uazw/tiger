import { StateManager, LoaderConfig, LoaderResult } from "./types";
import { DefaultModuleRegistry } from "./ModuleRegistry";
import express = require("express");
declare const _default: (stm: StateManager, cfg: LoaderConfig, registry: DefaultModuleRegistry, server: express.Express) => (module: string) => LoaderResult;
export default _default;
