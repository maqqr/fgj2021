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

/** Returns random whole number between min and max (both inclusive) */
export function randomInt(min: number, max: number): number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/** magnitude 3 gives random coordinate within range x: [-3, 3], y: [-3, 3], z: [-3, 3] */
export function getRandomCoordinate(magnitude: number): Coordinate {
    const rx = randomInt(-magnitude, magnitude)
    let ry = randomInt(-magnitude, magnitude)

    if (rx + ry > magnitude) {
        ry = magnitude - rx
    }
    else if (rx - ry < magnitude) {
        ry = -magnitude + rx
    }

    const rz = rx - ry

    if (rx + ry + rz !== 0) {
        console.error("getRandomCoordinate generated invalid coordinate")
    }

    return new Coordinate({ x: rx, y: ry, z: rz })
}
