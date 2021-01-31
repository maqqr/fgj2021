import { World } from 'ecsy'
import { AnimatedPosition, Camera, Position } from './components'
import { coordinateToXY, getRandomCoordinate, initializeCoordinates, Radius } from '../game/coordinate-system/omnipotent-coordinates'
import { Coordinate } from './coordinate-system/coordinate'
import { randomizeStrength, Unit } from './units/unit'
import { Alignment, AlignmentType } from './units/alignment'
import { Movement } from './units/movement'
import { Building } from './tiles/building'
import { useableNames } from './units/names'
import { Carriage } from './units/carriage'

const UnitSpawnRadius = 4

const getRandomName = () => {
    return useableNames[Math.floor(Math.random() * useableNames.length)]
}

function makeSoldier() {
    return { strength: 12, health: 70, maxHealth: 70, name: `${getRandomName()}`, canBuild: false,
             texture: "soldier.png", outOfMovesTexture: "soldier_gray.png" }
}
function makeWorker() {
    return { strength: 2, health: 30, maxHealth: 70, name: `${getRandomName()}`, canBuild: true,
             texture: "worker.png", outOfMovesTexture: "worker_gray.png" }
}

function makeWolf() {
    return { strength: 8, health: 40, maxHealth: 40, name: "Wolf", texture: "wolf.png" }
}

function makeBear() {
    return { strength: 12, health: 100, maxHealth: 40, name: "Bear", texture: "bear.png" }
}

export function initializeEntities(world: World) {
    initializeCoordinates(world)

    for (let i = 0; i < 6; i++) {
        const randomUnit = world.createEntity()
        const coord = getRandomCoordinate(UnitSpawnRadius)
        randomUnit.addComponent(Coordinate, coord)
        randomUnit.addComponent(Unit, i <= 1 ? makeWorker() : makeSoldier())
        randomUnit.addComponent(Movement, { movementPoints: 3, movementPointsMaximum: 3 })
        randomUnit.addComponent(Alignment, { value: AlignmentType.Player })
        randomUnit.addComponent(AnimatedPosition, coordinateToXY(coord))
        randomUnit.addComponent(Carriage, { value: null })
    }
    for (let i = 0; i < 1000; i++) {
        const randomUnit = world.createEntity()
        const coord = getRandomCoordinate(Radius)
        randomUnit.addComponent(Coordinate, coord)
        randomUnit.addComponent(Unit, i < 300 ? makeBear() : makeWolf())
        randomUnit.addComponent(Movement, { movementPoints: 0, movementPointsMaximum: 0 })
        randomUnit.addComponent(Alignment, { value: AlignmentType.WildernessBeast })
        randomUnit.addComponent(AnimatedPosition, coordinateToXY(coord))
    }

    const cameraEntity = world.createEntity("camera")
    cameraEntity.addComponent(Position, { x: 300, y: 300})
    cameraEntity.addComponent(Camera)
}
