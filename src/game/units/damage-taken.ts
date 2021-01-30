import { Component, Types } from 'ecsy'
import { registerComponent } from '../../register-component'

@registerComponent
export class DamageTaken extends Component<DamageTaken> {
    value: number

    static schema = {
        value: { type: Types.Number, default: 0 }
    }
}
