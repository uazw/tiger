
import {Tiger, TigerModuleDef, State, LoaderResult, StateManager, ModuleRegistry} from "./types"

import express = require("express");
import log4js = require("log4js")
import fs = require("fs")
import { DefaultStateManager } from "./StateManager";
import { DefaultModuleRegistry } from "./ModuleRegistry";

const DEFAULT_SERVER_PORT = 9527;

const LOGGER: log4js.Logger = log4js.getLogger("TigerServer");
LOGGER.level = "info";

export default class TigerServer implements Tiger {

  server: express.Express;

  moduleRegistry: ModuleRegistry

  serverPort?: number;

  stateManager: StateManager;

  constructor() {
    LOGGER.info("Creating a new TigerServer instance");
    this.server = express();
    this.stateManager = new DefaultStateManager;
    this.moduleRegistry = new DefaultModuleRegistry;
    this.stateManager.mount(this.server);
  }

  serve(basePath: string) {
    LOGGER.info(`Served in path: ${basePath}`);
    
    fs.readdir(basePath, (err, files) => {
      files.forEach(file => {
        LOGGER.info(`Preload module: [${file}]`)
        this.loadModules(basePath, file);
      });
    })

    fs.watch(basePath, (evt, file) => {
      
      let fullPath = `${basePath}/${file}`;
      LOGGER.info(`Event '${evt}' found on file '${fullPath}'`);

      if (file.match(/.*\.js$/) && fs.existsSync(fullPath)) {
        LOGGER.info(`Loading module ${file} automatically`);
        this.loadModules(basePath, file);
      } else if (file.match(/.*\.js$/)) {
        LOGGER.info(`Unload module ${file}`);
        this.moduleRegistry.unload(file);
      }
    });

    this.server.post("/loader", (request, response) => {
      let {path} = request.body;
      let {force} = request.params;

      LOGGER.info(`Manually load modules ${path} with force options?: ${force}`)
      
      let result = this.loadModules(basePath, path, force);

      response.send(result);
    });

    this.server.listen(this.serverPort || DEFAULT_SERVER_PORT);
  }

  config(configurer: (express: express.Express) => void) {
    configurer(this.server);
  }

  port(port: number) {
    this.serverPort = port;
  }

  private state(moduleName: string, value?: State): State {
    if (value) {
      return this.stateManager.set(moduleName, value);
    }
    return this.stateManager.get(moduleName);
  }

  private loadModules(basePath: string, module: string, force?: boolean): LoaderResult {
    let status = true;
    let servedPath = `/modules/${module}`;
    try {
      let mod: TigerModuleDef = require(`${basePath}/${module}`);
      
      this.moduleRegistry.update(module, mod)

      if (force || !this.state(module)) {
        this.state(module, mod.state || {});
      }
      
      LOGGER.info(`Mounting module on ${servedPath}`);
      this.server[mod.method](servedPath, (request, response) => {
        if (!this.moduleRegistry.valid(module)) {
          response.status(404).send({error: `module ${module} no longer valid`});
          return;
        }
        let state = this.state(module);
        LOGGER.info(`Handle request on ${servedPath}`);
        mod.handler(request, response, state);
        LOGGER.info(`Request ${servedPath} processed successfully`);
        this.state(module, state);
      });
    } catch (e) {
      LOGGER.error(`Error found when loading module ${module}: ${e}`, e);
      status = false;
    }

    return { status, path: servedPath };
  }
  
}
