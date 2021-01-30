import { System, SystemConstructor, Entity } from 'ecsy'
import { Coordinate } from './game/coordinate-system/coordinate'

export type SystemWithPriority = {
    priority: number,
    systemConstructor: SystemConstructor<System<Entity>>,
}

const registeredSystems: {[id: string]: SystemWithPriority} = {}

export function* getPrioritySystems() {
    for (const key in registeredSystems) {
        if (registeredSystems.hasOwnProperty(key)) {
            yield registeredSystems[key]
        }
    }
}

/** Class decorator that automatically adds it to the list of registered systems. */
export function registerWithPriority(priorityNumber: number) {
    return (constructor: SystemConstructor<System<Entity>>) => {
        registeredSystems[constructor.name] = { priority: priorityNumber, systemConstructor: constructor }
    }
}
