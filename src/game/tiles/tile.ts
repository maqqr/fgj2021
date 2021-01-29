import { World, Component, TagComponent, Types } from 'ecsy'
import { registerComponent } from '../../register-component'

export const enum TileType {
    Forest = 1,
    Snow,
    Mountain
}

@registerComponent
export class Tile extends Component<Tile> {
    tileType: TileType

    static schema = {
        tileType: { type: Types.Number, default: TileType.Forest },
    }
}