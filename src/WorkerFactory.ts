import { StateManager, WorkerDef } from "./types";

import * as log4js from "log4js";
import { Worker } from "./Modules";
import { schedule } from "node-cron";

const LOGGER = log4js.getLogger("Worker");
LOGGER.level = "info";

export default (module: string, workerDef: WorkerDef, stm: StateManager): Worker => {
    let worker = new Worker(module, workerDef);
    worker.task(schedule(workerDef.cron, () => {
      let state = stm(module);
      LOGGER.info(`${module} is running`);
      try {
        let newState = {...state}
        let result = worker.moduleDef.handler(newState);
        stm(module, { ...newState, ...result })
      } catch (e) {
        LOGGER.error(`Error occured when run module ${module}: ${e}`);
      }
      LOGGER.info(`${module} is done`);
      ;
    }));
    return worker; 
}