import { World, Component, TagComponent, Types } from 'ecsy'
import { registerComponent } from '../../register-component'

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