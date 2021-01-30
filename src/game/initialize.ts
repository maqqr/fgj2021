import { World } from 'ecsy'
import { Camera, Position } from './components'
import { getRandomCoordinate, initializeCoordinates, Radius } from '../game/coordinate-system/omnipotent-coordinates'
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
        randomUnit.addComponent(Unit, { strength: 12, health: 70 })
        randomUnit.addComponent(Movement, { movementPoints: 3, movementPointsMaximum: 3 })
        randomUnit.addComponent(Alignment, { value: AlignmentType.Player })
    }

    for (let i = 0; i < 1000; i++) {
        const randomUnit = world.createEntity()
        randomUnit.addComponent(Coordinate, getRandomCoordinate(Radius))
        randomUnit.addComponent(Unit, { strength: 12, health: 40 })
        randomUnit.addComponent(Movement, { movementPoints: 0, movementPointsMaximum: 0 })
        randomUnit.addComponent(Alignment, { value: AlignmentType.WildernessBeast })
    }

    const cameraEntity = world.createEntity("camera")
    cameraEntity.addComponent(Position, { x: 300, y: 300})
    cameraEntity.addComponent(Camera)
}
