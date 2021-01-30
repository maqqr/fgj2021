import { World, Component, TagComponent, Types } from 'ecsy'
import { registerComponent } from '../../register-component'

export const coordinateEquals = (first: Coordinate, second: Coordinate) =>
    first.x === second.x && first.y === second.y && first.z === second.z

@registerComponent
export class Coordinate extends Component<Coordinate> {
    x: number
    y: number
    z: number

    static schema = {
        x: { type: Types.Number, default: 0 },
        y: { type: Types.Number, default: 0 },
        z: { type: Types.Number, default: 0 }
    }
}

function convertToPositive(a: number): number {
    return a >= 0 ? a * 2 : -a * 2 - 1
}

function hash2(a: number, b: number): number {
    return 0.5 * (a + b) * (a + b + 1) + b
}

function hash3(a: number, b: number, c: number): number {
    return 0.5 * (hash2(a, b) + c) * (hash2(a, b) + c + 1) + c
}

export function coordinateHash(coord: Coordinate): number {
    const a = convertToPositive(Math.floor(coord.x))
    const b = convertToPositive(Math.floor(coord.y))
    const c = convertToPositive(Math.floor(coord.y))
    // https://en.wikipedia.org/wiki/Pairing_function#Cantor_pairing_function
    return hash3(coord.x, coord.y, coord.z)
}