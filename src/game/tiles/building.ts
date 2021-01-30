import { Component, Types } from 'ecsy'
import { registerComponent } from '../../register-component'

export const enum TileType {
    Invalid = 0,
    Forest = 1,
    Snow,
    Mountain
}

@registerComponent
export class Building extends Component<Building> {
    containedResources: number

    static schema = {
        containedResources: { type: Types.Number, default: 0 },
    }
}
