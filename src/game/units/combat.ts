import { Entity, World } from "ecsy"
import { Position, Velocity } from "../components"
import { Coordinate } from "../coordinate-system/coordinate"
import { coordinateToXY } from "../coordinate-system/omnipotent-coordinates"
import { DamageTaken } from "./damage-taken"
import { Unit } from "./unit"

const randomizeStrength = (unit: Unit) => (0.8 + 0.4 * Math.random()) * unit.strength
const partialMaxHealth = (unit: Unit) => unit.maxHealth * (0.1 + Math.random() * 0.4)
type DamageInfo = { damage: number, position: { x: number, y: number } }

export function fight(fighter: Entity, secondFighter: Entity): DamageInfo[] {
    const unit = fighter.getMutableComponent(Unit)!
    const secondUnit = secondFighter.getMutableComponent(Unit)!
    const firstStrength = randomizeStrength(unit)
    const secondStrength = randomizeStrength(secondUnit)
    const fullHealthLoss = partialMaxHealth(unit) + partialMaxHealth(secondUnit)
    const fullStrength = firstStrength + secondStrength
    const damageInfos: DamageInfo[] = []
    damageInfos.push(dealDamage(unit, fighter, secondStrength / fullStrength * fullHealthLoss))
    damageInfos.push(dealDamage(secondUnit, secondFighter, firstStrength / fullStrength * fullHealthLoss))
    return damageInfos
}

export function dealDamage(unit: Unit, entity: Entity, damageAmount: number): DamageInfo {
    unit.health -= damageAmount
    const coordinate = entity.getComponent(Coordinate)!
    let position = coordinateToXY(coordinate)
    return { damage: damageAmount, position }
}

export function createDamageIndicators(world: World, damageInfos: DamageInfo[]) {
    damageInfos.forEach(damageInfo => {
        let position = damageInfo.position
        const randomMagnitude = 25
        position.x += (Math.random() - 0.5) * randomMagnitude
        position.y += (Math.random() - 0.5) * randomMagnitude
        const damagee = world.createEntity()
        damagee.addComponent(Position, position)
        damagee.addComponent(Velocity, { x: 0, y: -20 })
        damagee.addComponent(DamageTaken, { value: damageInfo.damage })
    });
}
