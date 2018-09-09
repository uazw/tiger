import { TigerModuleDef, ModuleRegistry, TigerModule, PullModuleDef } from "./types";
import { ScheduledTask } from "node-cron";
export declare class DefaultModuleRegistry implements ModuleRegistry<TigerModuleDef> {
    modules: {
        [name: string]: TigerModuleDef;
    };
    update(name: string, moduleDef: TigerModuleDef): TigerModule<TigerModuleDef>;
    unload(name: string): TigerModule<TigerModuleDef>;
    valid(name: string): boolean;
    retrieve(name: string): TigerModule<TigerModuleDef>;
}
export declare class PullModuleRegistry implements ModuleRegistry<PullModuleDef> {
    modules: {
        [name: string]: PullModuleDef;
    };
    workers: {
        [name: string]: ScheduledTask;
    };
    update(name: string, moduleDef: PullModuleDef): TigerModule<PullModuleDef>;
    unload(name: string): TigerModule<PullModuleDef>;
    valid(name: string): boolean;
    retrieve(name: string): TigerModule<PullModuleDef>;
}
export declare type ModuleRegistries = [DefaultModuleRegistry, PullModuleRegistry];
