
import { TigerModuleDef, ModuleRegistry, TigerModule, PullModuleDef } from "./types"
import { ScheduledTask, schedule } from "node-cron";

export class DefaultModuleRegistry implements ModuleRegistry<TigerModuleDef> {

  modules: { [name: string]: TigerModuleDef } = {}

  update(name: string, moduleDef: TigerModuleDef): TigerModule<TigerModuleDef> {
    this.modules[name] = moduleDef;
    return { name, moduleDef }
  }
  unload(name: string): TigerModule<TigerModuleDef> {
    let moduleDef = this.modules[name];
    delete this.modules[name];
    return { name, moduleDef }
  }

  valid(name: string): boolean {
    return this.modules[name] !== null && this.modules[name] !== undefined;
  }

  retrieve(name: string): TigerModule<TigerModuleDef> {
    let moduleDef = this.modules[name];
    return { name, moduleDef }
  }

}

export class PullModuleRegistry implements ModuleRegistry<PullModuleDef> {

  modules: { [name: string]: PullModuleDef } = {}
  workers: { [name: string]: ScheduledTask } = {}

  update(name: string, moduleDef: PullModuleDef): TigerModule<PullModuleDef> {
    this.modules[name] = moduleDef;
    if (this.workers[name]) this.workers[name].destroy();
    this.workers[name] = schedule(moduleDef.cron, moduleDef.handler.bind({ state: moduleDef.state }));
    this.workers[name].start();
    return { name, moduleDef }
  }
  unload(name: string): TigerModule<PullModuleDef> {
    let moduleDef = this.modules[name];
    this.workers[name].destroy();
    delete this.modules[name];
    return { name, moduleDef }
  }

  valid(name: string): boolean {
    return this.modules[name] !== null && this.modules[name] !== undefined;
  }

  retrieve(name: string): TigerModule<PullModuleDef> {
    let moduleDef = this.modules[name];
    return { name, moduleDef }
  }

}

export type ModuleRegistries = [DefaultModuleRegistry, PullModuleRegistry];