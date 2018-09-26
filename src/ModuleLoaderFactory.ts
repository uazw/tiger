import { StateManager, LoaderConfig, LoaderResult, ModuleDef, isTigerModuleDef } from "./types";

import * as log4js from "log4js";

import TriggerFactory from "./TriggerFactory"
import WorkerFactory from "./WorkerFactory";
import { DefaultModuleRegistry } from "./ModuleRegistry";

import express = require("express");

const LOGGER = log4js.getLogger("ModuleLoader");
LOGGER.level = "info";

export default (stm: StateManager, cfg: LoaderConfig, registry: DefaultModuleRegistry, server: express.Express) => {
  LOGGER.info("Creating new module loader");

  return (module: string): LoaderResult => {
    let status = true
    try {
      let moduleDef: ModuleDef = require(`${cfg.basePath}/${module}`);
      stm(module, moduleDef.state);
      LOGGER.info(`Mounting a module as ${module}`)        
      if (isTigerModuleDef(moduleDef)) {
        let trigger = registry.update(module, TriggerFactory(module, moduleDef, stm));
        trigger.mountOn((n, h) => server[trigger.moduleDef.method](`/modules/${n}`, h));
      } else {
        let worker = registry.update(module, WorkerFactory(module, moduleDef, stm));
        worker.start();
      }
      LOGGER.info(`Mounted a module as ${module}`);

    } catch (e) {
      LOGGER.error(`Error found when loading module ${module}: ${e}`, e);
      status = false;
    }
    return { status, module }
  }
}
