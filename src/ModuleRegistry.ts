
import { ModuleRegistry, TigerModule, ModuleDef } from "./types"
export class DefaultModuleRegistry implements ModuleRegistry {

  modules: { [name: string]: ModuleDef } = {}

  update(name: string, moduleDef: ModuleDef): TigerModule {
    this.modules[name] = moduleDef;
    return { name, moduleDef }
  }

  unload(name: string): TigerModule {
    let moduleDef = this.modules[name];
    delete this.modules[name];
    return { name, moduleDef }
  }

  valid(name: string): boolean {
    return this.modules[name] !== null && this.modules[name] !== undefined;
  }

  retrieve(name: string): TigerModule {
    let moduleDef = this.modules[name];
    return { name, moduleDef }
  }
}