import { Component, ComponentConstructor } from 'ecsy'

export type RegisteredComponent = ComponentConstructor<Component<any>>

const registeredComponents: {[id: string]: RegisteredComponent} = {}

export function* getRegisteredComponents() {
    for (const key in registeredComponents) {
        if (registeredComponents.hasOwnProperty(key)) {
            yield registeredComponents[key]
        }
    }
}

/** Class decorator that automatically adds it to the list of registered components. */
export function registerComponent(constructor: ComponentConstructor<Component<any>>) {
    registeredComponents[constructor.name] = constructor
}
