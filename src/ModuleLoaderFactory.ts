import { StateManager, LoaderConfig, TigerModuleDef, ModuleRegistry, Server, LoaderResult, PullModuleDef } from "./types";

import * as log4js from "log4js";

import ExecutorFactory from "./ExecutorFactory"
import { ModuleRegistries } from "./ModuleRegistry";

const LOGGER = log4js.getLogger("ModuleLoader");
LOGGER.level = "info";

export default (stm: StateManager, cfg: LoaderConfig, registries: ModuleRegistries, server: Server) => {
  LOGGER.info("Creating new module loader");

  return (module: string, force: boolean = false): LoaderResult => {
    let path = `/modules/${module}`;
    let status = true
    try {
      let moduleDef: TigerModuleDef | PullModuleDef = require(`${cfg.basePath}/${module}`);

      if (isTigerModuleDef(moduleDef)) {
        registries[0].update(module, moduleDef);
      } else {
        registries[1].update(module, moduleDef);
      }

      if (force) {
        stm(module, moduleDef.state || {});
      }

      LOGGER.info(`Mounting module on ${path}`);
      if (isTigerModuleDef(moduleDef)) server[moduleDef.method](path, ExecutorFactory(path, module, stm, registries[0]));
      LOGGER.info(`Mounted module on ${path}`);

    } catch (e) {
      LOGGER.error(`Error found when loading module ${module}: ${e}`, e);
      status = false;
    }

    return { status, path }
  }
}

function isTigerModuleDef(moduleDef: TigerModuleDef | PullModuleDef): moduleDef is TigerModuleDef {
  return (<TigerModuleDef>moduleDef).method !== undefined;
}