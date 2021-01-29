import { Coordinate } from "./coordinate"
import { World } from 'ecsy'

export const TileWidth = 20

export const WorldCoordinates = new Array<Coordinate>()

export const coordinateToXY = (coordinate: Coordinate, tileWidth: number = TileWidth) => {
    const x = coordinate.z * tileWidth + coordinate.x * 0.5 * tileWidth + coordinate.y * -0.5 * tileWidth
    const y = Math.sqrt(3) * tileWidth * coordinate.z
    return { x, y }
}

export const XYToCoordinate = (x: number, y: number, tileWidth: number = TileWidth) => {

}

export function initializeCoordinates(world: World) {
    const Widths = 2
    const startingValue = -(Widths / 2)
    const endingValue = (Widths / 2)

    for (let x = startingValue; x <= endingValue; x++) {
        for (let y = startingValue; y <= endingValue; y++) {
            for (let z = startingValue; z <= endingValue; z++) {
                const coordinateEntity = world.createEntity()

                coordinateEntity.addComponent(Coordinate, { x, y, z })

            }
        }
    }
    console.log('world building succesful')
}
