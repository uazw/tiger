import { TigerModule, TriggerDef, WorkerDef, ServerRequestHandler } from "./types";
import { ScheduledTask } from "node-cron";
export declare class Trigger implements TigerModule {
    name: string;
    moduleDef: TriggerDef;
    valid: boolean;
    private _handler?;
    constructor(name: string, moduleDef: TriggerDef);
    handler(handler: ServerRequestHandler): void;
    mountOn(fn: (name: string, handler: ServerRequestHandler) => void): void;
    destroy(): void;
}
export declare class Worker implements TigerModule {
    name: string;
    moduleDef: WorkerDef;
    valid: boolean;
    private _task?;
    constructor(name: string, moduleDef: WorkerDef);
    task(task: ScheduledTask): ScheduledTask;
    start(): void;
    destroy(): void;
}
