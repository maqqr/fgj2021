import { Entity, System } from "ecsy"
import { registerWithPriority } from "../../register-system"
import { Coordinate } from "../coordinate-system/coordinate"
import { CoordinateSystem } from "../coordinate-system/coordinate-system"
import { getNeighbourCoordinates } from "../coordinate-system/omnipotent-coordinates"
import { Revealed } from "../tiles/revealed"
import { Tile, TileType } from "../tiles/tile"
import { Unit } from "../units/unit"

@registerWithPriority(80)
export class FogOfWarSystem extends System {

    static queries = {
        units: { components: [Coordinate, Unit] },
    }

    execute(deltaTime: number, time: number) {
        const coordSystem = this.world.getSystem(CoordinateSystem)

        this.queries.units.results.forEach(entity => {
            const coord = entity.getComponent(Coordinate)!
            const unit = entity.getComponent(Unit)!

            for (const neighbour of getNeighbourCoordinates(coord)) {
                const tileEntity = coordSystem.getTileAt(coord)
                if (tileEntity && !tileEntity.hasComponent(Revealed)) {
                    tileEntity.addComponent(Revealed)
                }
            }
        })
    }
}
