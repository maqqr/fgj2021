import { Component, Types } from 'ecsy'
import { registerComponent } from '../../register-component'

export const enum AlignmentType {
    Neutral = 0,
    Player,
    WildernessBeast
}

@registerComponent
export class Alignment extends Component<Alignment> {
    value: AlignmentType

    static schema = {
        value: { type: Types.Number, default: 1 }
    }
}
