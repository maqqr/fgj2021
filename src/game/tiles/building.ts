import { Component, Types } from 'ecsy'
import { registerComponent } from '../../register-component'

@registerComponent
export class Building extends Component<Building> {
    containedResources: number

    static schema = {
        containedResources: { type: Types.Number, default: 0 },
    }
}
