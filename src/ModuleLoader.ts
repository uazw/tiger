import { ModuleLoader, StateManager, LoaderConfig, TigerModuleDef, ModuleRegistry, Server, LoaderResult } from "./types";

import * as log4js from "log4js";

import Executor from "./Executor"

const LOGGER = log4js.getLogger("ModuleLoader");
LOGGER.level = "info";

export class DefaultModuleLoader implements ModuleLoader {
  
  stateManager: StateManager;
  loaderConfig: LoaderConfig;
  moduleRegistry: ModuleRegistry;
  server: Server;

  constructor(stateManager: StateManager, 
    loaderConfig: LoaderConfig,
    moduleRegistry: ModuleRegistry,
    server: Server) {
    this.stateManager = stateManager;
    this.loaderConfig = loaderConfig;
    this.moduleRegistry = moduleRegistry;
    this.server = server;
  }

  load(module: string, force: boolean = false): LoaderResult {
    let path = `/modules/${module}`;
    let status = true
    try {
      let moduleDef: TigerModuleDef = require(`${this.loaderConfig.basePath}/${module}`);
      
      this.moduleRegistry.update(module, moduleDef)

      if (force) {
        this.stateManager.set(module, moduleDef.state || {});
      }
      
      LOGGER.info(`Mounting module on ${path}`);
      this.server[moduleDef.method](path, Executor(path, module, this.stateManager, this.moduleRegistry));
      LOGGER.info(`Mounted module on ${path}`);

    } catch (e) {
      LOGGER.error(`Error found when loading module ${module}: ${e}`, e);
      status = false;
    }

    return {status, path}
  }

  mount(): void {
    this.server.post("/loader", (request, response) => {
      let { path } = request.body;
      let { force } = request.params;

      LOGGER.info(`Manually load modules ${path} with force options?: ${force}`)
      
      let result = this.load(path, force);

      response.send(result);
    });
  }
}