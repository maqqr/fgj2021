import { Coordinate } from "./coordinate"
import { World } from 'ecsy'


export const WorldCoordinates = new Array<Coordinate>()

export function initializeCoordinates(world: World) {

    const Widths = 100
    const startingValue = -(Widths / 2)
    const endingValue = (Widths / 2)

    for (let x = startingValue; x < endingValue; x++) {
        for (let y = startingValue; x < endingValue; y++) {
            for (let z = startingValue; z < endingValue; z++) {
                const coordinateEntity = world.createEntity()

                coordinateEntity.addComponent(Coordinate, { x, y, z })
            }
        }
    }
}
