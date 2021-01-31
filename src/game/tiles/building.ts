import { Component, Entity, Types, World } from 'ecsy'
import { registerComponent } from '../../register-component'
import { Coordinate } from '../coordinate-system/coordinate'
import { coordinateToXY } from '../coordinate-system/omnipotent-coordinates'
import { Alignment, AlignmentType } from '../units/alignment'
import { Carriage } from '../units/carriage'
import { Unit } from '../units/unit'
import { createHealingIndicator } from '../units/unit-health-system'

@registerComponent
export class Building extends Component<Building> {
    containedResources: number

    static schema = {
        containedResources: { type: Types.Number, default: 0 },
    }
}

export function checkForBuildingInteraction(entity: Entity, tile: Entity, world : World) {
    const house = tile.getMutableComponent(Building)
    const carriage = entity.getMutableComponent(Carriage)
    const unit = entity.getMutableComponent(Unit)!
    const unitAlignment = entity.getMutableComponent(Alignment)!
    //const unitAlignment = entity.getMutableComponent(Alignment)!
    if (house) {
        if (carriage && carriage.value) {
            house.containedResources++
            carriage.value = null
        }
        //console.log("Hit house")
        if (unitAlignment.value === AlignmentType.Player && unit.health != unit.maxHealth){
            const healing = unit.maxHealth - unit.health
            unit.health = unit.maxHealth
            console.log("Healed")
            const coordinate = entity.getComponent(Coordinate)!
            let position = coordinateToXY(coordinate)
            createHealingIndicator(world, { amount: healing, position })
        }
    }
}