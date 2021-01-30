import { Component, Types, TagComponent } from 'ecsy'
import { registerComponent } from '../../register-component'


@registerComponent
export class TurnCount extends Component<TurnCount> {
    value: number

    static schema = {
        value: { type: Types.Number, default: 1 },
    }
}

@registerComponent
export class TurnEndOrder extends TagComponent {
}

@registerComponent
export class TurnStarted extends TagComponent {
}