import { Coordinate } from "./coordinate"
import { World } from 'ecsy'
import { Tile, TileType } from "../tiles/tile"
import { Resource, ResourceType } from "../tiles/resource"

export const TileWidth = 50

const typeWeights = [
    { type: TileType.Forest, weight: 50 },
    { type: TileType.Mountain, weight: 20 },
    { type: TileType.Snow, weight: 70 },
]
const totalTypeWeight = typeWeights
    .map(x => x.weight)
    .reduce((old, current) => old + current, 0)

const resourceWeights = [
    { type: ResourceType.Deer, weight: 5 },
    { type: ResourceType.Mushrooms, weight: 5 },
    { type: ResourceType.Ore, weight: 10 },
    { type: ResourceType.Invalid, weight: 90 },
]
const totalResourceWeight = resourceWeights
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

export const selectTileType = (totalWeight: number, weights: any) => {
    let weighter = Math.random() * totalWeight
    for (const iterator of weights) {
        weighter -= iterator.weight
        if (weighter <= 0) {
            return iterator.type
        }
    }
    return null
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

                //Perhaps in own code later
                const selectedType = selectTileType(totalTypeWeight, typeWeights)
                coordinateEntity.addComponent(Tile, { tileType: selectedType })

                const selectedResource = selectTileType(totalResourceWeight, resourceWeights)
                if (selectedResource !== null && selectedResource !== ResourceType.Invalid) {
                    coordinateEntity.addComponent(Resource, { resource: selectedResource })
                }
            }
        }
    }
}

export function getDistance(a: Coordinate, b: Coordinate){
    return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2
}
