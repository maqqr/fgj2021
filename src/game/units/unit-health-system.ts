import { Not, Entity, System, SystemQueries, ComponentConstructor, NotComponent, World } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { Position, Velocity } from '../components'
import { Coordinate } from '../coordinate-system/coordinate'
import { CoordinateSystem } from '../coordinate-system/coordinate-system'
import { Resource } from '../tiles/resource'
import { TurnCount, TurnEndOrder, TurnStarted } from '../turns/turn-count'
import { TurnEntityName } from '../turns/turn-system'
import { Carriage } from './carriage'
import { DamageTaken } from './damage-taken'
import { Movement } from './movement'
import { Unit } from './unit'

// this could be the same as damageinfo tbh
type HealingInfo = { amount: number, position: { x: number, y: number } }
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
            if (unit.health <= 0) {
                const carriage = entity.getComponent(Carriage)
                if (carriage && carriage.value) {
                    const coordinate = entity.getComponent(Coordinate)!
                    const tile = this.world.getSystem(CoordinateSystem).getTileAt(coordinate)!
                    const resource = tile.getMutableComponent(Resource)
                    if (resource) {
                        resource.resource = carriage.value
                    } else {
                        tile.addComponent(Resource, { resource: carriage.value })
                    }
                }
                entity.remove()
            } else if (turnStarted) {
                //console.log("Healed")
                unit.health = Math.min(unit.maxHealth, unit.health + TurnHealAmount)
            }
        })
    }
}

export function createHealingIndicator(world: World, healingInfo: HealingInfo) {
    const damagee = world.createEntity()
    damagee.addComponent(Position, healingInfo.position)
    damagee.addComponent(Velocity, { x: 0, y: -20 })
    damagee.addComponent(DamageTaken, { value: -healingInfo.amount })
}