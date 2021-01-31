import { Component, Types } from 'ecsy'
import { registerComponent } from '../../register-component'
import { useableNames } from './names'

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

export const getRandomName = () => {
    return useableNames[Math.floor(Math.random() * useableNames.length)]
}

export function makeSoldier() {
    return { strength: 12, health: 70, maxHealth: 70, name: `${getRandomName()}`, canBuild: false,
             texture: "soldier.png", outOfMovesTexture: "soldier_gray.png" }
}
export function makeWorker() {
    return { strength: 2, health: 30, maxHealth: 70, name: `${getRandomName()}`, canBuild: true,
             texture: "worker.png", outOfMovesTexture: "worker_gray.png" }
}

export function makeWolf() {
    return { strength: 8, health: 40, maxHealth: 40, name: "Wolf", texture: "wolf.png" }
}

export function makeBear() {
    return { strength: 12, health: 100, maxHealth: 40, name: "Bear", texture: "bear.png" }
}