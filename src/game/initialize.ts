import { World } from 'ecsy'
import { Camera, Position } from './components'
import { getRandomCoordinate, initializeCoordinates } from '../game/coordinate-system/omnipotent-coordinates'
import { Coordinate } from './coordinate-system/coordinate'
import { Unit } from './units/unit'
import { Alignment, AlignmentType } from './units/alignment'
import { Movement } from './units/movement'

const UnitSpawnRadius = 4

export function initializeEntities(world: World) {
    initializeCoordinates(world)

    for (let i = 0; i < 5; i++) {
        const randomUnit = world.createEntity()
        randomUnit.addComponent(Coordinate, getRandomCoordinate(UnitSpawnRadius))
        randomUnit.addComponent(Unit)
        randomUnit.addComponent(Movement, { movementPoints: 2, movementPointsMaximum: 2 })
        randomUnit.addComponent(Alignment, { value: AlignmentType.Player })
    }

    const cameraEntity = world.createEntity("camera")
    cameraEntity.addComponent(Position, { x: 300, y: 300})
    cameraEntity.addComponent(Camera)
}
