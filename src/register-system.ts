import { System, SystemConstructor, Entity } from 'ecsy'

export type SystemWithPriority = {
    priority: number,
    systemConstructor: SystemConstructor<System<Entity>>,
}

const registeredSystems: SystemWithPriority[] = []

export function getPrioritySystems(): SystemWithPriority[] {
    return registeredSystems
}

/** Class decorator that automatically adds it to the list of registered systems. */
export function registerWithPriority(priorityNumber: number) {
    return (constructor: SystemConstructor<System<Entity>>) => {
        registeredSystems.push({ priority: priorityNumber, systemConstructor: constructor })
    }
}
