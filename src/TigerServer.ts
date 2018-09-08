
import {Tiger, TigerModule, State, LoaderResult} from "./types"

import express = require("express");
import log4js = require("log4js")
import fs = require("fs")

const DEFAULT_SERVER_PORT = 9527;

const LOGGER: log4js.Logger = log4js.getLogger("TigerServer");
LOGGER.level = "info";

export default class TigerServer implements Tiger {

  server: express.Express;

  triggers: { [key: string]: TigerModule | undefined } = {}

  db: { [key: string]: State } = {}

  serverPort?: number;

  constructor() {
    LOGGER.info("Creating a new TigerServer instance");
    this.server = express();
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
        this.triggers[file] = undefined;
      }
    })

    this.server.post("/loader", (request, response) => {
      let {path} = request.body;
      let {force} = request.params;

      LOGGER.info(`Manually load modules ${path} with force options?: ${force}`)
      
      let result = this.loadModules(basePath, path, force);

      response.send(result);
    });

    this.server.get("/state/:module", (request, response) => {
      response.send(this.state(request.params["module"]));
    });

    this.server.listen(this.serverPort || DEFAULT_SERVER_PORT);
  }

  config(configurer: (express: express.Express) => void) {
    configurer(this.server);
  }

  port(port: number) {
    this.serverPort = port;
  }

  private state(moduleName: string, value?: State): State | undefined {
    if (value) {
      this.db[moduleName] = value
    }
    return this.db[moduleName]
  }

  private loadModules(basePath: string, path: string, force?: boolean): LoaderResult {
    let status = true;
    let servedPath = `/modules/${path}`;
    try {
      let mod: TigerModule = require(`${basePath}/${path}`);
      
      this.triggers[path] = mod;

      if (force || !this.state(path)) {
        this.state(path, mod.state || {});
      }
      
      LOGGER.info(`Mounting module on ${servedPath}`);
      this.server[mod.method](servedPath, (request, response) => {
        if (!this.triggers[path]) {
          response.status(404).send({error: `module ${path} no longer valid`});
          return;
        }
        let state = this.state(path);
        LOGGER.info(`Handle request on ${servedPath}`);
        mod.handler(request, response, state);
        LOGGER.info(`Request ${servedPath} processed successfully`);
        this.state(path, state);
      });
    } catch (e) {
      LOGGER.error(`Error found when loading module ${path}: ${e}`, e);
      status = false;
    }

    return { status, path: servedPath };
  }
  
}
