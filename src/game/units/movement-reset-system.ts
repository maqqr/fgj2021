import { Not, Entity, System, SystemQueries, ComponentConstructor, NotComponent } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { TurnCount, TurnEndOrder, TurnStarted } from '../turns/turn-count'
import { TurnEntityName } from '../turns/turn-system'
import { Movement } from './movement'

@registerWithPriority(5)
export class MovementResetSystem extends System {
    static queries = {
        units: { components: [Movement] },
    }

    execute(delta: number, time: number): void {
        const turnEntity = this.world.entityManager.getEntityByName(TurnEntityName)

        if (turnEntity?.getComponent(TurnStarted)) {
            this.queries.units.results.forEach(entity => {
                const movement = entity.getMutableComponent(Movement)!
                movement.movementPoints = movement.movementPointsMaximum
            })
        }
    }
}