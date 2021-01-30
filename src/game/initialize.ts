import { World } from 'ecsy'
import { AnimatedPosition, Camera, Position } from './components'
import { coordinateToXY, getRandomCoordinate, initializeCoordinates, Radius } from '../game/coordinate-system/omnipotent-coordinates'
import { Coordinate } from './coordinate-system/coordinate'
import { Unit } from './units/unit'
import { Alignment, AlignmentType } from './units/alignment'
import { Movement } from './units/movement'
import { Building } from './tiles/building'
import { useableNames } from './units/names'

const UnitSpawnRadius = 4

const getRandomName = () => {
    return useableNames[Math.floor(Math.random() * useableNames.length)]
}

export function initializeEntities(world: World) {
    initializeCoordinates(world)

    for (let i = 0; i < 5; i++) {
        const randomUnit = world.createEntity()
        const coord = getRandomCoordinate(UnitSpawnRadius)
        randomUnit.addComponent(Coordinate, coord)
        randomUnit.addComponent(Unit, { strength: 12, health: 70, maxHealth: 70, name: getRandomName() })
        randomUnit.addComponent(Movement, { movementPoints: 3, movementPointsMaximum: 3 })
        randomUnit.addComponent(Alignment, { value: AlignmentType.Player })
        randomUnit.addComponent(AnimatedPosition, coordinateToXY(coord))
    }

    for (let i = 0; i < 1000; i++) {
        const randomUnit = world.createEntity()
        const coord = getRandomCoordinate(Radius)
        randomUnit.addComponent(Coordinate, coord)
        randomUnit.addComponent(Unit, { strength: 12, health: 40, maxHealth: 40, name: "Wolf" })
        randomUnit.addComponent(Movement, { movementPoints: 0, movementPointsMaximum: 0 })
        randomUnit.addComponent(Alignment, { value: AlignmentType.WildernessBeast })
        randomUnit.addComponent(AnimatedPosition, coordinateToXY(coord))
    }

    const cameraEntity = world.createEntity("camera")
    cameraEntity.addComponent(Position, { x: 300, y: 300})
    cameraEntity.addComponent(Camera)
}
