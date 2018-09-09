/// <reference types="express" />
import { StateManager, ModuleRegistry, TigerModuleDef } from "./types";
declare const _default: (path: string, module: string, stm: StateManager, registry: ModuleRegistry<TigerModuleDef>) => (req: import("express").Request, res: import("express").Response) => void;
export default _default;
