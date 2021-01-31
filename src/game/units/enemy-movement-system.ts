import { Not, Entity, System, SystemQueries, ComponentConstructor, NotComponent, World } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { Coordinate, addCoordinate } from '../coordinate-system/coordinate'
import { TurnCount, TurnEndOrder, TurnStarted, TurnEnded } from '../turns/turn-count'
import { TurnEntityName } from '../turns/turn-system'
import { Alignment, AlignmentType } from './alignment'
import { Movement, moveSelectedEntity } from './movement'
import { getNeighbourCoordinates, getRandomCoordinate} from '../coordinate-system/omnipotent-coordinates'
import { CoordinateSystem } from '../coordinate-system/coordinate-system'

@registerWithPriority(3)
export class EnemyMovementSystem extends System {
    static queries = {
        units: { components: [Movement], alignment: [Alignment] },
    }

    execute(delta: number, time: number): void {
        const world = this.world;
        const turnEntity = world.entityManager.getEntityByName(TurnEntityName)

        if (turnEntity?.getComponent(TurnEnded)) {
            this.queries.units.results.forEach(entity => {
                const coordSystem : CoordinateSystem = world.getSystem(CoordinateSystem)
                if (entity.getComponent(Alignment)!.value === AlignmentType.WildernessBeast){         
                    wander(coordSystem, entity, world)
                }
            })
            turnEntity.removeComponent(TurnEnded)
            turnEntity.addComponent(TurnStarted)
            console.log("AI movement ended")
        }
    }
}

function wander(coordinateSystem: CoordinateSystem, entity : Entity, world : World){
    const movement = entity.getMutableComponent(Movement)!
    for (let index = 0; index < movement.movementPoints; index++) {
        const originalCoordinate = entity.getMutableComponent(Coordinate)!
        const randomOffset = getRandomCoordinate(1)
        const newTargetCoordinate = addCoordinate(originalCoordinate, randomOffset)
        moveSelectedEntity(coordinateSystem, newTargetCoordinate, entity, world)
    }
    console.log("Wandered")
}