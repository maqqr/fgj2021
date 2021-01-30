import { Coordinate } from "./coordinate"
import { World } from 'ecsy'
import { Tile, TileType } from "../tiles/tile"
import { Resource, ResourceType } from "../tiles/resource"

export const TileWidth = 50
export const Radius = 50

const typeWeights = [
    { type: TileType.Forest, weight: 50 },
    { type: TileType.Mountain, weight: 20 },
    { type: TileType.Snow, weight: 70 },
]
const totalTypeWeight = typeWeights
    .map(x => x.weight)
    .reduce((old, current) => old + current, 0)

const resourceWeights = [{
    tileType: TileType.Forest,
    typedWeights: [
        { type: ResourceType.Deer, weight: 5 },
        { type: ResourceType.Mushrooms, weight: 5 },
        { type: ResourceType.Invalid, weight: 70 },
    ]
    }, {
    tileType: TileType.Mountain,
    typedWeights: [
            { type: ResourceType.Ore, weight: 15 },
            { type: ResourceType.Invalid, weight: 70 },
    ],
    }, {
    tileType: TileType.Snow,
    typedWeights: [
        { type: ResourceType.Deer, weight: 15 },
        { type: ResourceType.Invalid, weight: 70 },
    ],
    }
]

const magicalHeight = Math.sqrt(3)
const hexSideSize = TileWidth / Math.sqrt(3)

export const WorldCoordinates = new Array<Coordinate>()

export const coordinateToXY = (coordinate: Coordinate, tileWidth: number = TileWidth) => {
    const x = tileWidth + coordinate.x * 0.5 * tileWidth + coordinate.y * -0.5 * tileWidth
    const y = magicalHeight * tileWidth * 0.5 * coordinate.z
    return { x, y }
}

function cubeToAxial(cube: {x: number, y: number, z: number}) {
    return { x: cube.x, y: cube.z }
}

function axialToCube(hex: {r: number, q: number}) {
    const x = hex.q
    const z = hex.r
    const y = -x - z
    return { x, y, z }
}

function cubeRound(cube: {x: number, y: number, z: number}) {
    let x = Math.round(cube.x)
    let y = Math.round(cube.y)
    let z = Math.round(cube.z)

    const xDiff = Math.abs(x - cube.x)
    const yDiff = Math.abs(y - cube.y)
    const zDiff = Math.abs(z - cube.z)

    if (xDiff > yDiff && xDiff > zDiff) {
        x = -y - z
    }
    else if (yDiff > zDiff) {
        y = -x - z
    }
    else {
        z = -x - y
    }

    return { x, y, z }
}

export const XYToCoordinate = (x: number, y: number, tileWidth: number = TileWidth) => {
    const q = (Math.sqrt(3) / 3 * x - 1.0 / 3.0 * y) / hexSideSize
    const r = (2.0 / 3.0 * y) / hexSideSize
    const axial = { q, r }
    const cube = cubeRound(axialToCube(axial))
    // No idea why these have to be done, but it works now
    cube.x -= 1
    cube.y += 1
    return new Coordinate(cube)
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

                // Perhaps in own code later
                const selectedType = selectTileType(totalTypeWeight, typeWeights)
                coordinateEntity.addComponent(Tile, { tileType: selectedType })

                const typeArray = resourceWeights.find(rw => rw.tileType === selectedType)!
                const totalResourceWeight = typeArray.typedWeights
                    .map(w => w.weight)
                    .reduce((old, current) => old + current, 0)
                const selectedResource = selectTileType(totalResourceWeight, typeArray.typedWeights)

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

/** Returns random whole number between min and max (both inclusive) */
export function randomInt(min: number, max: number): number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/** magnitude 3 gives random coordinate within range x: [-3, 3], y: [-3, 3], z: [-3, 3] */
export function getRandomCoordinate(magnitude: number): Coordinate {
    const rx = randomInt(-magnitude, magnitude)
    let yMin = -magnitude
    let yMax = magnitude
    if (rx < 0) {
        yMin = -(magnitude + rx)
    }
    if (rx > 0) {
        yMax = magnitude - rx
    }
    const ry = randomInt(yMin, yMax)

    const rz = 0 - rx - ry

    if (rx + ry + rz !== 0) {
        console.error("getRandomCoordinate generated invalid coordinate")
    }

    return new Coordinate({ x: rx, y: ry, z: rz })
}
