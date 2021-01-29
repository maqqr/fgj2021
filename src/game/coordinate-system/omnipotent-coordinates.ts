import { Coordinate } from "./coordinate"
import { World } from 'ecsy'
import { Tile, TileType } from "../tiles/tile"

export const TileWidth = 50

const typeWeights = [
    { type: TileType.Forest, weight: 50 },
    { type: TileType.Mountain, weight: 20 },
    { type: TileType.Snow, weight: 70 },
]
const totalWeight = typeWeights
    .map(x => x.weight)
    .reduce((old, current) => old + current, 0)

export const WorldCoordinates = new Array<Coordinate>()

export const coordinateToXY = (coordinate: Coordinate, tileWidth: number = TileWidth) => {
    const x = tileWidth + coordinate.x * 0.5 * tileWidth + coordinate.y * -0.5 * tileWidth
    const y = Math.sqrt(3) * tileWidth * 0.5 * coordinate.z
    return { x, y }
}

export const XYToCoordinate = (x: number, y: number, tileWidth: number = TileWidth) => {

}

export const selectTileType = () : TileType => {
    let weighter = Math.random() * totalWeight
    for (const iterator of typeWeights) {
        weighter -= iterator.weight
        if (weighter <= 0) {
            return iterator.type
        }
    }
    return TileType.Invalid
}

export function initializeCoordinates(world: World) {
    const Radius = 5
    const startingValue = -Radius
    const endingValue = Radius

    for (let x = startingValue; x <= endingValue; x++) {
        for (let y = startingValue; y <= endingValue; y++) {
            for (let z = startingValue; z <= endingValue; z++) {
                if (x + y + z !== 0)
                {
                    continue
                }
                const coordinateEntity = world.createEntity()
                coordinateEntity.addComponent(Coordinate, { x, y, z })

                const selectedType = selectTileType()
                //Perhaps in own code later
                coordinateEntity.addComponent(Tile, { tileType: selectedType })
            }
        }
    }
}

export function getDistance(a: Coordinate, b: Coordinate){
    return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2
}
