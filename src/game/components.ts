import { World, Component, TagComponent, Types } from 'ecsy'
import { registerComponent, getRegisteredComponents } from '../register-component'

// All components in other files must be included here to be compiled
import './test-stuff/example-components'
import './coordinate-system/coordinate'
import './tiles/resource'
import './tiles/revealed'
import './tiles/tile'
import './tiles/visible'
import './input-system/selected'
import './input-system/input-system'

export function registerComponents(world: World): void {
    for (const componentConstructor of getRegisteredComponents()) {
        world.registerComponent(componentConstructor)
    }
}

// Component schema must match the attributes in the class.
// Possible types for the schema are Number, Boolean, String, Array, Ref and JSON.
// More complex types need to be defined without schema and with custom copy and reset methods.

@registerComponent
export class Position extends Component<Position> {
    x: number
    y: number
    static schema = {
        x: { type: Types.Number, default: 0 },
        y: { type: Types.Number, default: 0 },
    }
}

@registerComponent
export class Velocity extends Component<Velocity> {
    x: number
    y: number
    static schema = {
        x: { type: Types.Number, default: 0 },
        y: { type: Types.Number, default: 0 },
    }
}
