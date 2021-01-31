import { Component, Entity, Types, World } from 'ecsy'
import { registerComponent } from '../../register-component'
import { Coordinate } from '../coordinate-system/coordinate'
import { CoordinateSystem } from '../coordinate-system/coordinate-system'
import { checkNeighbourCoordinates, pathfind } from '../pathfinding'
import { Building } from '../tiles/building'
import { Resource } from '../tiles/resource'
import { Alignment } from './alignment'
import { Carriage } from './carriage'
import { fight, createDamageIndicators } from './combat'
import { Unit } from './unit'

@registerComponent
export class Movement extends Component<Movement> {
    movementPoints: number
    movementPointsMaximum: number

    static schema = {
        movementPoints: { type: Types.Number, default: 1 },
        movementPointsMaximum: { type: Types.Number, default: 1 }
    }
}

export function moveSelectedEntity(coordinateSystem: CoordinateSystem,
    coordinate: Coordinate,
    entity: Entity,
    world: World) {
    const moverAlignment = entity.getComponent(Alignment)!
    const tileEntity = coordinateSystem.getTileAt(coordinate)
    if (tileEntity) {
        const unitCoordinate = entity.getMutableComponent(Coordinate)!
        const movement = entity.getMutableComponent(Movement)
        if (!movement || movement.movementPoints === 0) {
            return
        }
        //const coordSystem = this.world.getSystem(CoordinateSystem)
        const passableCallback = coordinateSystem.isPassable.bind(coordinateSystem)

        const path = pathfind(unitCoordinate, coordinate, passableCallback)
        if (!path || path.length === 0) {
            return
        }
        path.splice(0, 1)

        let step = 0
        while (movement.movementPoints > 0 && step < path.length) {
            if (entity.getComponent(Unit)!.health <= 0) {
                return
            }
            const stepFromPath = path[step]
            unitCoordinate.x = stepFromPath.x
            unitCoordinate.y = stepFromPath.y
            unitCoordinate.z = stepFromPath.z
            movement.movementPoints--
            step++
            const fightNearby = (fightCoordinate: Coordinate) => {
                if (entity.getComponent(Unit)!.health <= 0) {
                    return true
                }
                const possibleTarget = coordinateSystem.getUnitAt(fightCoordinate)
                if (possibleTarget && possibleTarget.getComponent(Alignment)?.value !== moverAlignment.value) {
                    const damageinfo = fight(entity, possibleTarget)
                    createDamageIndicators(world, damageinfo)
                    movement.movementPoints = 0
                    return true
                }
                return true
            }
            if (entity.getComponent(Unit)!.health <= 0) {
                return true
            }
            checkNeighbourCoordinates(unitCoordinate, fightNearby)

            const carriage = entity.getMutableComponent(Carriage)
            const tileStepped = coordinateSystem.getTileAt(stepFromPath)!
            if (carriage && !carriage.value) {
                const possibleResource = tileStepped.getComponent(Resource)
                if (possibleResource) {
                    carriage.value = possibleResource.resource
                    tileStepped.removeComponent(Resource)
                }
            }
            const house = tileStepped.getMutableComponent(Building)
            if (house && carriage && carriage.value) {
                house.containedResources++
                carriage.value = null
            }
        }
    }
}