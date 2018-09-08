import { ModuleLoader, StateManager, LoaderConfig, ModuleRegistry, Server, LoaderResult } from "./types";
export declare class DefaultModuleLoader implements ModuleLoader {
    stateManager: StateManager;
    loaderConfig: LoaderConfig;
    moduleRegistry: ModuleRegistry;
    server: Server;
    constructor(stateManager: StateManager, loaderConfig: LoaderConfig, moduleRegistry: ModuleRegistry, server: Server);
    load(module: string, force?: boolean): LoaderResult;
}
