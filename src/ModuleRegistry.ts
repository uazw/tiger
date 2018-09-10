
import { ModuleRegistry, TigerModule, ModuleDef } from "./types"
export class DefaultModuleRegistry implements ModuleRegistry {

  modules: { [name: string]: TigerModule } = {}

  update<T extends TigerModule>(name: string, module: T): T {
    return this.modules[name] = module;
  }

  unload(name: string): TigerModule {
    let moduleDef = this.modules[name];
    delete this.modules[name];
    return moduleDef;
  }

  valid(name: string): boolean {
    return this.modules[name] !== null && this.modules[name] !== undefined;
  }

  retrieve(name: string): TigerModule {
    let moduleDef = this.modules[name];
    return moduleDef;
  }
}