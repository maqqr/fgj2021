import { Not, Entity, System, SystemQueries, ComponentConstructor, NotComponent } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { TurnCount, TurnEnded, TurnEndOrder, TurnStarted } from './turn-count'

export const TurnEntityName = 'turnBuoy'

@registerWithPriority(2)
export class TurnSystem extends System {
    static queries = {
        turnEvents: {
            components: [TurnCount, TurnEndOrder],
            listen: {
                added: true
            }
        }
    }

    init() {
        const turnEntity = this.world.createEntity(TurnEntityName)
        turnEntity.addComponent(TurnCount)
    }

    execute(delta: number, time: number): void {
        this.queries.turnEvents.added!.forEach(entity => {
            const turnCount = entity.getMutableComponent(TurnCount)!
            turnCount.value++

            entity.removeComponent(TurnEndOrder)
            entity.addComponent(TurnEnded)
        })
    }
}