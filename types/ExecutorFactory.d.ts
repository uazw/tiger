/// <reference types="express" />
import { StateManager } from "./types";
import { DefaultModuleRegistry } from "./ModuleRegistry";
declare const _default: (path: string, module: string, stm: StateManager, registry: DefaultModuleRegistry) => (req: import("express").Request, res: import("express").Response) => void;
export default _default;
