import { StateManager, PullModuleDef } from "./types";

import * as log4js from "log4js";
import { DefaultModuleRegistry } from "./ModuleRegistry";

const LOGGER = log4js.getLogger("Worker");
LOGGER.level = "info";


export default (module: string, stm: StateManager, registry: DefaultModuleRegistry) => {
    return () => {
        let { moduleDef } = registry.retrieve(module);
        let state = stm(module);
        LOGGER.info(`${module} is running`);
        (moduleDef as PullModuleDef).handler(state);
        LOGGER.info(`${module} is done`);
        stm(module, state);
    }
}