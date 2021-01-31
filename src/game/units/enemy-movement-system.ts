import { Not, Entity, System, SystemQueries, ComponentConstructor, NotComponent } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { Coordinate } from '../coordinate-system/coordinate'
import { TurnCount, TurnEndOrder, TurnStarted, TurnEnded } from '../turns/turn-count'
import { TurnEntityName } from '../turns/turn-system'
import { Alignment, AlignmentType } from './alignment'
import { Movement } from './movement'

@registerWithPriority(80)
export class EnemyMovementSystem extends System {
    static queries = {
        units: { components: [Movement], alignment: [Alignment], coordinate: [Coordinate] },
    }

    execute(delta: number, time: number): void {
        const turnEntity = this.world.entityManager.getEntityByName(TurnEntityName)

        if (turnEntity?.getComponent(TurnEnded)) {
            this.queries.units.results.forEach(entity => {
                if (entity.getComponent(Alignment)!.value === AlignmentType.WildernessBeast){
                    //let position = entity.getMutableComponent(Coordinate)!
                    //position.x + 1
                    //console.log("pos" + position.x)
                }
            })
            turnEntity.removeComponent(TurnEnded)
            turnEntity.addComponent(TurnStarted)
        }
    }
}
