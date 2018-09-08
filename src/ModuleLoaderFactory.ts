import { StateManager, LoaderConfig, TigerModuleDef, ModuleRegistry, Server, LoaderResult } from "./types";

import * as log4js from "log4js";

import ExecutorFactory from "./ExecutorFactory"

const LOGGER = log4js.getLogger("ModuleLoader");
LOGGER.level = "info";

export default (stm: StateManager, cfg: LoaderConfig, registry: ModuleRegistry, server: Server) => {
  LOGGER.info("Creating new module loader");
  
  return (module: string, force: boolean = false): LoaderResult => {
    let path = `/modules/${module}`;
    let status = true
    try {
      let moduleDef: TigerModuleDef = require(`${cfg.basePath}/${module}`);

      registry.update(module, moduleDef)

      if (force) {
        stm(module, moduleDef.state || {});
      }

      LOGGER.info(`Mounting module on ${path}`);
      server[moduleDef.method](path, ExecutorFactory(path, module, stm, registry));
      LOGGER.info(`Mounted module on ${path}`);

    } catch (e) {
      LOGGER.error(`Error found when loading module ${module}: ${e}`, e);
      status = false;
    }

    return { status, path }
  }
}
