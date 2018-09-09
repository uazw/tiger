import { ModuleRegistry, TigerModule, ModuleDef } from "./types";
export declare class DefaultModuleRegistry implements ModuleRegistry {
    modules: {
        [name: string]: ModuleDef;
    };
    update(name: string, moduleDef: ModuleDef): TigerModule;
    unload(name: string): TigerModule;
    valid(name: string): boolean;
    retrieve(name: string): TigerModule;
}
