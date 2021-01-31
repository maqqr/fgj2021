import { Component, Types } from 'ecsy'
import { registerComponent } from '../../register-component'

export const randomizeStrength = (unit: Unit) => (0.8 + 0.4 * Math.random()) * unit.strength
export const partialMaxHealth = (unit: Unit) => unit.maxHealth * (0.1 + Math.random() * 0.4)

@registerComponent
export class Unit extends Component<Unit> {
    strength: number
    canBuild: boolean
    health: number
    maxHealth: number
    name: string
    texture: string
    outOfMovesTexture: string

    static schema = {
        strength: { type: Types.Number, default: 1 },
        canBuild: { type: Types.Boolean, default: false },
        health: { type: Types.Number, default: 100 },
        maxHealth: {type: Types.Number, default: 100 },
        name: { type: Types.String, default: "Jorma"},
        texture: { type: Types.String, default: "error.png"},
        outOfMovesTexture: { type: Types.String, default: "error.png"}
    }
}
