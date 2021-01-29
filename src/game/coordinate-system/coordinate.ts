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