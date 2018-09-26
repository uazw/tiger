import { StateManager, Request, Response, TriggerDef } from "./types";

import * as log4js from "log4js";
import { DefaultModuleRegistry } from "./ModuleRegistry";
import { Trigger } from "./Modules";

const LOGGER = log4js.getLogger("Executor");
LOGGER.level = "info";

export default (module: string, triggerDef: TriggerDef, stm: StateManager): Trigger => {
  let trigger = new Trigger(module, triggerDef);
  stm(module, triggerDef.state);
  trigger.handler((req: Request, res: Response) => {
    if (!trigger.valid) {
      res.status(404).send({ error: `module ${module} no longer valid` });
      return;
    }
    
    let state = stm(module);
    let newState = { ...state };
    LOGGER.info(`Handle request for ${module}`);

    try {
      let result = trigger.moduleDef.handler(req, res, newState);
      stm(module, { ...newState, ...result });
    } catch(e) {
      LOGGER.error(`Error occured when run module ${module}: ${e}`);
    }
    LOGGER.info(`Request for ${module} processed successfully`);
  });
  return trigger;
}
