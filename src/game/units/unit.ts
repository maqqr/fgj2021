import { Component, Types } from 'ecsy'
import { registerComponent } from '../../register-component'

@registerComponent
export class Unit extends Component<Unit> {
    strength: number
    canBuild: boolean

    static schema = {
        strength: { type: Types.Number, default: 1 },
        canBuild: { type: Types.Boolean, default: false },
    }
}
