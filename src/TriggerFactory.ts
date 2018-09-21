import { StateManager, Request, Response, TriggerDef } from "./types";

import * as log4js from "log4js";
import { DefaultModuleRegistry } from "./ModuleRegistry";
import { Trigger } from "./Modules";

const LOGGER = log4js.getLogger("Executor");
LOGGER.level = "info";

export default (module: string, triggerDef: TriggerDef, stm: StateManager): Trigger => {
  let trigger = new Trigger(module, triggerDef);
  trigger.handler((req: Request, res: Response) => {
    if (!trigger.valid) {
      res.status(404).send({ error: `module ${module} no longer valid` });
      return;
    }
    
    let state = stm(module);
    LOGGER.info(`Handle request for ${module}`);
    trigger.moduleDef.handler(req, res, state);
    LOGGER.info(`Request for ${module} processed successfully`);
    stm(module, state);
  });
  return trigger;
}
