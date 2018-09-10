import { StateManager, Request, Response, TigerModuleDef } from "./types";

import * as log4js from "log4js";
import { DefaultModuleRegistry } from "./ModuleRegistry";

const LOGGER = log4js.getLogger("Executor");
LOGGER.level = "info";

export default (path: string, module: string, stm: StateManager, registry: DefaultModuleRegistry) => {
  return (req: Request, res: Response) => {
    if (!registry.valid(module)) {
      res.status(404).send({ error: `module ${module} no longer valid` });
      return;
    }

    let { moduleDef } = registry.retrieve(module);
    let state = stm(module);
    LOGGER.info(`Handle request on ${path}`);
    (moduleDef as TigerModuleDef).handler(req, res, state);
    LOGGER.info(`Request ${path} processed successfully`);
    stm(module, state);
  }
}
