import { Component, Entity, Types, World } from 'ecsy'
import { registerComponent } from '../../register-component'
import { Coordinate } from '../coordinate-system/coordinate'
import { CoordinateSystem } from '../coordinate-system/coordinate-system'
import { checkNeighbourCoordinates, pathfind } from '../pathfinding'
import { Building, checkForBuildingInteraction } from '../tiles/building'
import { Resource } from '../tiles/resource'
import { Alignment, AlignmentType } from './alignment'
import { Carriage, checkForCarriageInteraction } from './carriage'
import { checkNeighborsForFight, checkForFight } from './combat'
import { Unit } from './unit'
import { getDistance } from '../coordinate-system/omnipotent-coordinates'

@registerComponent
export class Movement extends Component<Movement> {
    movementPoints: number
    movementPointsMaximum: number

    static schema = {
        movementPoints: { type: Types.Number, default: 1 },
        movementPointsMaximum: { type: Types.Number, default: 1 }
    }
}

// maybe a bit redundant
function stepTo(stepperCoordinate: Coordinate, targetCoordinate: Coordinate) {
    stepperCoordinate.x = targetCoordinate.x
    stepperCoordinate.y = targetCoordinate.y
    stepperCoordinate.z = targetCoordinate.z
}

export function moveSelectedEntity(world: World,
    targetCoordinate: Coordinate,
    entity: Entity) {
    const coordinateSystem: CoordinateSystem = world.getSystem(CoordinateSystem)
    const tileEntity = coordinateSystem.getTileAt(targetCoordinate)
    if (tileEntity) {
        const unitCoordinate = entity.getMutableComponent(Coordinate)!
        const movement = entity.getMutableComponent(Movement)
        if (!movement || movement.movementPoints === 0) {
            return
        }
        //const coordSystem = this.world.getSystem(CoordinateSystem)
        const passableCallback = coordinateSystem.isPassable.bind(coordinateSystem)
        const isNeighboringCoordinate = getDistance(targetCoordinate, unitCoordinate) === 1

        // special case for 1 length steps
        if (isNeighboringCoordinate) {
            if (coordinateSystem.isPassable(targetCoordinate)) {
                //console.log("Neigboring tile passable")
                stepTo(unitCoordinate, targetCoordinate)
                movement.movementPoints--
                const tileStepped = coordinateSystem.getTileAt(targetCoordinate)!
                const fightHappened : boolean = checkNeighborsForFight(coordinateSystem, targetCoordinate, entity)
                // return early from fight so units can block interactions
                if (fightHappened) return
                checkForCarriageInteraction(entity, tileStepped)
                checkForBuildingInteraction(entity, tileStepped, world)
                return
            }
            else {
                const fightHappened = checkForFight(coordinateSystem, targetCoordinate, entity)
                if (fightHappened) {
                    //console.log("Neigboring fight")
                    return
                }
            }
        }

        const path = pathfind(unitCoordinate, targetCoordinate, passableCallback)
        if (!path || path.length === 0) {
            return
        }
        path.splice(0, 1)

        // do pathfinding to target and check stuff on the way
        let step = 0
        while (movement.movementPoints > 0 && step < path.length) {
            if (entity.getComponent(Unit)!.health <= 0) {
                return
            }
            const stepFromPath = path[step]
            stepTo(unitCoordinate, stepFromPath)
            movement.movementPoints--
            step++
            const fightHappened = checkNeighborsForFight(coordinateSystem, stepFromPath, entity)
            if (fightHappened) return
            //checkNeighbourCoordinates(unitCoordinate, )
            const tileStepped = coordinateSystem.getTileAt(stepFromPath)!

            checkForCarriageInteraction(entity, tileStepped)
            checkForBuildingInteraction(entity, tileStepped, world)
        }
    }
}