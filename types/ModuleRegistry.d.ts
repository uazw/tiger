import { ModuleRegistry, TigerModule } from "./types";
export declare class DefaultModuleRegistry implements ModuleRegistry {
    modules: {
        [name: string]: TigerModule;
    };
    update<T extends TigerModule>(name: string, module: T): T;
    unload(name: string): TigerModule;
    valid(name: string): boolean;
    retrieve(name: string): TigerModule;
}
