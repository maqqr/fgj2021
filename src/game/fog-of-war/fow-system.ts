import { Entity, System } from "ecsy"
import { registerWithPriority } from "../../register-system"
import { Coordinate } from "../coordinate-system/coordinate"
import { Tile, TileType } from "../tiles/tile"
import { Unit } from "../units/unit"

@registerWithPriority(80)
export class FogOfWarSystem extends System {

    static queries = {
        units: { components: [Coordinate, Unit] },
    }

    execute(deltaTime: number, time: number) {

        this.queries.units.results.forEach(entity => {
            const coord = entity.getComponent(Coordinate)!
            const unit = entity.getComponent(Unit)!
        })
    }
}
