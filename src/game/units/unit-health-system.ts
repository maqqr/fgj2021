import { Not, Entity, System, SystemQueries, ComponentConstructor, NotComponent } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { TurnCount, TurnEndOrder, TurnStarted } from '../turns/turn-count'
import { TurnEntityName } from '../turns/turn-system'
import { Movement } from './movement'
import { Unit } from './unit'

export const TurnHealAmount = 3

@registerWithPriority(80)
export class UnitHealthSystem extends System {
    static queries = {
        units: { components: [Unit] },
    }

    execute(delta: number, time: number): void {
        const turnEntity = this.world.entityManager.getEntityByName(TurnEntityName)
        const turnStarted = !!turnEntity?.getComponent(TurnStarted)

        this.queries.units.results.forEach(entity => {
            const unit = entity.getMutableComponent(Unit)!
            if (unit.health <= 0){
                entity.remove()
            } else if (turnStarted) {
                unit.health = Math.min(unit.maxHealth, unit.health + TurnHealAmount)
            }
        })
    }
}