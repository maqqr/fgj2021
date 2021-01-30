import { Entity, System } from "ecsy"
import { registerWithPriority } from "../../register-system"
import { Coordinate } from "../coordinate-system/coordinate"
import { CoordinateSystem } from "../coordinate-system/coordinate-system"
import { getDistance, getNeighbourCoordinates } from "../coordinate-system/omnipotent-coordinates"
import { Revealed } from "../tiles/revealed"
import { Tile, TileType } from "../tiles/tile"
import { Unit } from "../units/unit"

@registerWithPriority(80)
export class FogOfWarSystem extends System {

    static queries = {
        units: { components: [Coordinate, Unit] },
    }

    private revealTile(coord: Coordinate) {
        const coordSystem = this.world.getSystem(CoordinateSystem)
        const tileEntity = coordSystem.getTileAt(coord)
        if (tileEntity && !tileEntity.hasComponent(Revealed)) {
            tileEntity.addComponent(Revealed)
        }
    }

    execute(deltaTime: number, time: number) {
        this.queries.units.results.forEach(entity => {
            const unitCoord = entity.getComponent(Coordinate)!
            const unit = entity.getComponent(Unit)!
            const viewRadius = 2

            for (let x = -viewRadius-1; x < viewRadius+1; x++) {
                for (let y = -viewRadius-1; y < viewRadius+1; y++) {
                    for (let z = -viewRadius-1; z < viewRadius+1; z++) {
                        if (x + y + z === 0) {
                            const checkCoord = new Coordinate(
                                { x: unitCoord.x + x, y: unitCoord.y + y, z: unitCoord.z + z})

                            if (getDistance(unitCoord, checkCoord) <= viewRadius) {
                                this.revealTile(checkCoord)
                            }
                        }
                    }
                }
            }
        })
    }
}
