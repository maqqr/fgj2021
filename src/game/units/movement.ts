import { Component, Types } from 'ecsy'
import { registerComponent } from '../../register-component'

@registerComponent
export class Movement extends Component<Movement> {
    movementPoints: number
    movementPointsMaximum: number

    static schema = {
        movementPoints: { type: Types.Number, default: 1 },
        movementPointsMaximum: { type: Types.Number, default: 1 }
    }
}
