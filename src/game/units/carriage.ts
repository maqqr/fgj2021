import { Component, Entity, Types } from 'ecsy'
import { registerComponent } from '../../register-component'
import { Coordinate } from '../coordinate-system/coordinate'
import { Resource, ResourceType } from '../tiles/resource'
import { Alignment, AlignmentType } from './alignment'


@registerComponent
export class Carriage extends Component<Carriage> {
    value: ResourceType | null

    static schema = {
        value: { type: Types.Number, default: null }
    }
}

export function checkForCarriageInteraction(entity: Entity, tile: Entity) {
    const carriage = entity.getMutableComponent(Carriage)
    const unitAlignment = entity.getMutableComponent(Alignment)!
    const possibleResource = tile.getComponent(Resource)
    if (possibleResource) {
        if (unitAlignment.value === AlignmentType.WildernessBeast) {
            tile.removeComponent(Resource)
            //console.log("Nomnom")
        } else if (carriage && !carriage.value) {
            carriage.value = possibleResource.resource
            tile.removeComponent(Resource)
        }
    }
}