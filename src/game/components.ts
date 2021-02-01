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
import './units/alignment'
import './units/unit'
import './units/carriage'
import './units/movement-reset-system'
import './turns/turn-count'
import './turns/turn-system'
import './turns/turn-system-clean-up'
import './units/unit-health-system'
import { Player } from './test-stuff/example-components'
import { Coordinate } from './coordinate-system/coordinate'
import { Resource } from './tiles/resource'
import { Revealed } from './tiles/revealed'
import { Unknown } from './tiles/unknown'
import { Tile } from './tiles/tile'
import { Visible } from './tiles/visible'
import { Selected } from './input-system/selected'
import { Building } from './tiles/building'
import { Unit } from './units/unit'
import { TurnCount, TurnEnded, TurnEndOrder, TurnStarted } from './turns/turn-count'
import { Alignment } from './units/alignment'
import { Movement } from './units/movement'
import { DamageTaken } from './units/damage-taken'
import { Carriage } from './units/carriage'

export function registerComponents(world: World): void {
    // for (const componentConstructor of getRegisteredComponents()) {
    //     console.log(`world.registerComponent(${componentConstructor.name})`)
    //     world.registerComponent(componentConstructor)
    // }
    world.registerComponent(Player)
    world.registerComponent(Coordinate)
    world.registerComponent(Resource)
    world.registerComponent(Revealed)
    world.registerComponent(Tile)
    world.registerComponent(Visible)
    world.registerComponent(Selected)
    world.registerComponent(Building)
    world.registerComponent(Unit)
    world.registerComponent(TurnCount)
    world.registerComponent(TurnEndOrder)
    world.registerComponent(TurnStarted)
    world.registerComponent(TurnEnded)
    world.registerComponent(Alignment)
    world.registerComponent(Movement)
    world.registerComponent(DamageTaken)
    world.registerComponent(Carriage)
    world.registerComponent(Position)
    world.registerComponent(AnimatedPosition)
    world.registerComponent(Velocity)
    world.registerComponent(Camera)
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
export class AnimatedPosition extends Component<AnimatedPosition> {
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

@registerComponent
export class Camera extends TagComponent {}
