import { Component, Types } from 'ecsy'
import { registerComponent } from '../../register-component'
import { ResourceType } from '../tiles/resource'


@registerComponent
export class Carriage extends Component<Carriage> {
    value: ResourceType | null

    static schema = {
        value: { type: Types.Number, default: null }
    }
}
