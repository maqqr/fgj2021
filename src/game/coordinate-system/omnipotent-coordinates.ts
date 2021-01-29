import { Coordinate } from "./coordinate"
import { World } from 'ecsy'

export const TileWidth = 50

export const WorldCoordinates = new Array<Coordinate>()

export const coordinateToXY = (coordinate: Coordinate, tileWidth: number = TileWidth) => {
    const x = tileWidth + coordinate.x * 0.5 * tileWidth + coordinate.y * -0.5 * tileWidth
    const y = Math.sqrt(3) * tileWidth * 0.5 * coordinate.z
    return { x, y }
}

export const XYToCoordinate = (x: number, y: number, tileWidth: number = TileWidth) => {

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
            }
        }
    }
    console.log('world building succesful')
}

export function getDistance(a: Coordinate, b: Coordinate){
    return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2
}
