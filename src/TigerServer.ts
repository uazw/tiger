
import {Tiger, TigerModuleDef, State, LoaderResult, StateManager, ModuleRegistry, ModuleLoader, LoaderConfig} from "./types"

import express = require("express");
import log4js = require("log4js")
import fs = require("fs")
import { DefaultStateManager } from "./StateManager";
import { DefaultModuleRegistry } from "./ModuleRegistry";
import { DefaultModuleLoader } from "./ModuleLoader";

const DEFAULT_SERVER_PORT = 9527;

const LOGGER: log4js.Logger = log4js.getLogger("TigerServer");
LOGGER.level = "info";

export default class TigerServer implements Tiger {

  server: express.Express;

  moduleRegistry: ModuleRegistry

  serverPort?: number;

  stateManager: StateManager;
  moduleLoader: ModuleLoader;

  loaderConfig: LoaderConfig = { basePath: "./" }

  constructor(basePath: string) {
    LOGGER.info("Creating a new TigerServer instance");
    LOGGER.info(`Served in path: ${basePath}`);
    this.server = express();
    this.stateManager = new DefaultStateManager;
    this.moduleRegistry = new DefaultModuleRegistry;
    this.stateManager.mount(this.server);
    this.loaderConfig.basePath = basePath;
    this.moduleLoader = 
      new DefaultModuleLoader(this.stateManager, this.loaderConfig, this.moduleRegistry, this.server);
  }

  serve() {
    let basePath = this.loaderConfig.basePath
    fs.readdir(basePath, (err, files) => {
      files.forEach(file => {
        LOGGER.info(`Preload module: [${file}]`)
        this.moduleLoader.load(file);
      });
    })

    fs.watch(basePath, (evt, file) => {
      let fullPath = `${basePath}/${file}`;
      LOGGER.info(`Event '${evt}' found on file '${fullPath}'`);

      if (file.match(/.*\.js$/) && fs.existsSync(fullPath)) {
        LOGGER.info(`Loading module ${file} automatically`);
        this.moduleLoader.load(file);
      } else if (file.match(/.*\.js$/)) {
        LOGGER.info(`Unload module ${file}`);
        this.moduleRegistry.unload(file);
      }
    });

    this.server.listen(this.serverPort || DEFAULT_SERVER_PORT);
  }

  config(configurer: (express: express.Express) => void) {
    configurer(this.server);
  }

  port(port: number) {
    this.serverPort = port;
  }
}
