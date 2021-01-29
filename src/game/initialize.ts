import { World } from 'ecsy'
import { Position, Velocity } from './components'
import { Player } from './test-stuff/example-components'
import { getRandomCoordinate, initializeCoordinates, Radius } from '../game/coordinate-system/omnipotent-coordinates'
import { Coordinate } from './coordinate-system/coordinate'
import { Unit } from './units/unit'

export function initializeEntities(world: World) {
    initializeCoordinates(world)

    for (let i = 0; i < 5; i++) {
        const randomUnit = world.createEntity()
        randomUnit.addComponent(Coordinate, getRandomCoordinate(Radius))
        randomUnit.addComponent(Unit)
    }
}
