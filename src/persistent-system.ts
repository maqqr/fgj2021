import { System, World } from 'ecsy'

/** PersistentSystems have a persistent state that is not cleared when reloading code. */
export abstract class PersistentSystem<State> extends System {
    protected state: State

    abstract initializeState() : void

    restoreState(state: State): void {
        this.state = state
    }

    dumpState(): State {
        return this.state
    }
}

export type Dump = { [id: string]: any }

export function initializeAllPersistentSystems(world: World) {
    for (const system of world.getSystems()) {
        if (system instanceof PersistentSystem) {
            system.initializeState()
        }
    }
}

export function dumpAllPersistentSystems(world: World): Dump {
    const allDumps: Dump = {}
    for (const system of world.getSystems()) {
        if (system instanceof PersistentSystem) {
            allDumps[system.constructor.name] = system.dumpState()
        }
    }
    return allDumps
}

export function restoreAllPersistentSystems(world: World, allDumps: Dump): void {
    for (const system of world.getSystems()) {
        if (system instanceof PersistentSystem) {
            const dump: any = allDumps[system.constructor.name]
            if (dump) {
                system.restoreState(dump)
            }
        }
    }
}
