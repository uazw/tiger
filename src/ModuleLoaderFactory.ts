import { StateManager, LoaderConfig, Server, LoaderResult, ModuleDef, isTigerModuleDef } from "./types";

import * as log4js from "log4js";
import { schedule } from "node-cron"

import ExecutorFactory from "./ExecutorFactory"
import WorkerFactory from "./WorkerFactory";
import { DefaultModuleRegistry } from "./ModuleRegistry";

const LOGGER = log4js.getLogger("ModuleLoader");
LOGGER.level = "info";

export default (stm: StateManager, cfg: LoaderConfig, registry: DefaultModuleRegistry, server: Server) => {
  LOGGER.info("Creating new module loader");

  return (module: string, force: boolean = false): LoaderResult => {
    let path = `/modules/${module}`;
    let status = true
    try {
      let moduleDef: ModuleDef = require(`${cfg.basePath}/${module}`);

      registry.update(module, moduleDef);

      if (force) {
        stm(module, moduleDef.state || {});
      }

      if (isTigerModuleDef(moduleDef)) {
        LOGGER.info(`Mounting module on ${path}`);
        server[moduleDef.method](path, ExecutorFactory(path, module, stm, registry));
        LOGGER.info(`Mounted module on ${path}`);
      } else {
        LOGGER.info(`Mounting a scheduled worker on ${path}`)
        moduleDef._worker = schedule(moduleDef.cron, WorkerFactory(module, stm, registry));
        moduleDef._worker.start();
        LOGGER.info(`Mounted a scheduled worker on ${path}`);
      }

    } catch (e) {
      LOGGER.error(`Error found when loading module ${module}: ${e}`, e);
      status = false;
    }

    return { status, path }
  }
}

