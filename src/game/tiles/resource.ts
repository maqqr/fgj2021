import { Component, Types } from 'ecsy'
import { registerComponent } from '../../register-component'

export const enum ResourceType {
    Invalid = 0,
    Deer = 1,
    Mushrooms,
    Ore
}

@registerComponent
export class Resource extends Component<Resource> {
    resource: ResourceType

    static schema = {
        resource: { type: Types.Number, default: ResourceType.Invalid },
    }
}