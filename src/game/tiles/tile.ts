import { Component, TagComponent, Types } from 'ecsy'
import { registerComponent } from '../../register-component'
import { randomInt } from '../coordinate-system/omnipotent-coordinates'

export const enum TileType {
    Invalid = 0,
    Forest = 1,
    Snow,
    Mountain
}

@registerComponent
export class Tile extends Component<Tile> {
    tileType: TileType
    tileVariation: number

    static schema = {
        tileType: { type: Types.Number, default: TileType.Invalid },
        tileVariation: { type: Types.Number, default: 0 },
    }
}

export function getTilePath(tile: Tile): string {
    let tileSprite: string = "error.png"
    switch (tile.tileType) {
        case TileType.Forest:
            switch (tile.tileVariation) {
                case 0:
                    tileSprite = "forest.png"
                    break
                case 1:
                    tileSprite = "forest2.png"
                    break
            }
            break
        case TileType.Snow:
            switch (tile.tileVariation) {
                case 0:
                    tileSprite = "tile.png"
                    break
                case 1:
                    tileSprite = "tile2.png"
                    break
                case 2:
                    tileSprite = "tile3.png"
                    break
                case 3: // lolz, nice weighting my dudes
                    tileSprite = "tile2.png"
                    break
                case 4: // lolz
                    tileSprite = "tile2.png"
                    break
            }
            break
        case TileType.Mountain:
            switch (tile.tileVariation) {
                case 0:
                    tileSprite = "mountain.png"
                    break
                case 1:
                    tileSprite = "mountain2.png"
                    break
            }
            break
    }
    if (tileSprite === "error.png") {
        console.error("Had error in tile " + tileTypeTypeToString(tile.tileType) + " " + tile.tileVariation)
    }
    //console.log("Using tile: " + tileTypeTypeToString(tile.tileType) + " " + tile.tileVariation)
    return tileSprite
}


export function tileTypeTypeToString(tileType: TileType) {
    switch (tileType) {
        case TileType.Invalid: return "Invalid"
        case TileType.Forest: return "Forest"
        case TileType.Snow: return "Snow"
        case TileType.Mountain: return "Mountain"
    }
}

export function tileTypeVariationAmount(tileType: TileType): number {
    switch (tileType) {
        case TileType.Invalid: return 1
        case TileType.Forest: return 2
        case TileType.Snow: return 5
        case TileType.Mountain: return 2
    }
}