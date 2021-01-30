import { World } from 'ecsy'
import { Camera, Position } from './components'
import { getRandomCoordinate, initializeCoordinates } from '../game/coordinate-system/omnipotent-coordinates'
import { Coordinate } from './coordinate-system/coordinate'
import { Unit } from './units/unit'

const UnitSpawnRadius = 4

export function initializeEntities(world: World) {
    initializeCoordinates(world)

    for (let i = 0; i < 5; i++) {
        const randomUnit = world.createEntity()
        randomUnit.addComponent(Coordinate, getRandomCoordinate(UnitSpawnRadius))
        randomUnit.addComponent(Unit)
    }

    const cameraEntity = world.createEntity("camera")
    cameraEntity.addComponent(Position, { x: 300, y: 300})
    cameraEntity.addComponent(Camera)
}
