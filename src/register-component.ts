import { Component, ComponentConstructor } from 'ecsy'

export type RegisteredComponent = ComponentConstructor<Component<any>>

const registeredComponents: RegisteredComponent[] = []

export function getRegisteredComponents(): RegisteredComponent[] {
    return registeredComponents
}

/** Class decorator that automatically adds it to the list of registered components. */
export function registerComponent(constructor: ComponentConstructor<Component<any>>) {
    registeredComponents.push(constructor)
}
