import { World } from 'ecsy'
import { AnimatedPosition, Camera, Position } from './components'
import { coordinateToXY, getDistance, getRandomCoordinate, initializeCoordinates, Radius } from '../game/coordinate-system/omnipotent-coordinates'
import { Coordinate } from './coordinate-system/coordinate'
import { Unit, makeBear, makeWorker, makeSoldier, makeWolf } from './units/unit'
import { Alignment, AlignmentType } from './units/alignment'
import { Movement } from './units/movement'
import { Building } from './tiles/building'
import { Carriage } from './units/carriage'

const UnitSpawnRadius = 4

function getRandomFarCoordinate(radius: number) {
    let coord = getRandomCoordinate(radius)
    while (getDistance({x:0,y:0,z:0}, coord) < UnitSpawnRadius + 2) {
        coord = getRandomCoordinate(radius)
    }
    return coord
}

export function initializeEntities(world: World) {
    initializeCoordinates(world)

    for (let i = 0; i < 6; i++) {
        const isWorker = i < 1
        const randomUnit = world.createEntity()
        const coord = getRandomCoordinate(UnitSpawnRadius)
        randomUnit.addComponent(Coordinate, coord)
        randomUnit.addComponent(Unit, isWorker ? makeWorker() : makeSoldier())
        randomUnit.addComponent(Movement, { movementPoints: 3, movementPointsMaximum: 3 })
        randomUnit.addComponent(Alignment, { value: AlignmentType.Player })
        randomUnit.addComponent(AnimatedPosition, coordinateToXY(coord))
        if (isWorker)
            randomUnit.addComponent(Carriage, { value: null })
    }
    const maxEnemies = 100
    for (let i = 0; i < maxEnemies; i++) {
        const isBear = i < maxEnemies / 3
        const randomUnit = world.createEntity()
        const coord = getRandomFarCoordinate(Radius)
        randomUnit.addComponent(Coordinate, coord)
        randomUnit.addComponent(Unit, isBear ? makeBear() : makeWolf())
        randomUnit.addComponent(Movement, { movementPoints: isBear ? 2 : 3, movementPointsMaximum: isBear ? 2 : 3 })
        randomUnit.addComponent(Alignment, { value: AlignmentType.WildernessBeast })
        randomUnit.addComponent(AnimatedPosition, coordinateToXY(coord))
    }

    const cameraEntity = world.createEntity("camera")
    cameraEntity.addComponent(Position, { x: 300, y: 300})
    cameraEntity.addComponent(Camera)
}
