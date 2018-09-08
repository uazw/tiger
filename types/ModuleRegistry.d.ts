import { TigerModuleDef, ModuleRegistry, TigerModule } from "./types";
export declare class DefaultModuleRegistry implements ModuleRegistry {
    modules: {
        [name: string]: TigerModuleDef;
    };
    update(name: string, moduleDef: TigerModuleDef): TigerModule;
    unload(name: string): TigerModule;
    valid(name: string): boolean;
    retrieve(name: string): TigerModule;
}
