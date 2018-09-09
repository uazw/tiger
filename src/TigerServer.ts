
import express = require("express");
import log4js = require("log4js")
import fs = require("fs")
import stm from "./StateManager";
import { DefaultModuleRegistry, ModuleRegistries, PullModuleRegistry } from "./ModuleRegistry";
import loaderFactory from "./ModuleLoaderFactory";

const DEFAULT_SERVER_PORT = 9527;

const LOGGER: log4js.Logger = log4js.getLogger("TigerServer");
LOGGER.level = "info";

export default (basePath: string, serverPort?: number, configurer?: (express: express.Express) => void) => {
  LOGGER.info("Creating a new TigerServer instance");
  LOGGER.info(`Served in path: ${basePath}`);
  let server = express();
  let registries: ModuleRegistries = [new DefaultModuleRegistry, new PullModuleRegistry];
  let cfg = { basePath };
  let moduleLoader = loaderFactory(stm, cfg, registries, server);

  if (configurer) configurer(server);

  fs.readdir(basePath, (err, files) => {
    files.forEach(file => {
      LOGGER.info(`Preload module: [${file}]`)
      moduleLoader(file);
    });
  })

  return () => {

    fs.watch(basePath, (evt, file) => {
      let fullPath = `${basePath}/${file}`;
      LOGGER.info(`Event '${evt}' found on file '${fullPath}'`);

      if (file.match(/.*\.js$/) && fs.existsSync(fullPath)) {
        LOGGER.info(`Loading module ${file} automatically`);
        moduleLoader(file);
      } else if (file.match(/.*\.js$/)) {
        LOGGER.info(`Unload module ${file}`);
        for (let registry of registries) {
          registry.unload(file);
        }
      }
    });

    server.listen(serverPort || DEFAULT_SERVER_PORT);
  }
}
