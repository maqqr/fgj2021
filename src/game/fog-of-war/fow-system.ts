import { Entity, System } from "ecsy"
import { registerWithPriority } from "../../register-system"
import { Coordinate } from "../coordinate-system/coordinate"
import { CoordinateSystem } from "../coordinate-system/coordinate-system"
import { getDistance, getNeighbourCoordinates } from "../coordinate-system/omnipotent-coordinates"
import { Building } from "../tiles/building"
import { Revealed } from "../tiles/revealed"
import { Tile, TileType } from "../tiles/tile"
import { Alignment, AlignmentType } from "../units/alignment"
import { Unit } from "../units/unit"

@registerWithPriority(80)
export class FogOfWarSystem extends System {

    static queries = {
        units: { components: [Coordinate, Unit, Alignment] },
        buildings: { components: [Coordinate, Building, Alignment] },
    }

    private revealTile(coord: Coordinate) {
        const coordSystem = this.world.getSystem(CoordinateSystem)
        const tileEntity = coordSystem.getTileAt(coord)
        if (tileEntity && !tileEntity.hasComponent(Revealed)) {
            tileEntity.addComponent(Revealed)
        }
    }

    private checkFieldOfView(coord: Coordinate, viewRadius: number) {
        for (let x = -viewRadius-1; x < viewRadius+1; x++) {
            for (let y = -viewRadius-1; y < viewRadius+1; y++) {
                for (let z = -viewRadius-1; z < viewRadius+1; z++) {
                    if (x + y + z === 0) {
                        const checkCoord = new Coordinate(
                            { x: coord.x + x, y: coord.y + y, z: coord.z + z})

                        if (getDistance(coord, checkCoord) <= viewRadius) {
                            this.revealTile(checkCoord)
                        }
                    }
                }
            }
        }
    }

    execute(deltaTime: number, time: number) {
        this.queries.units.results.forEach(entity => {
            if (entity.getComponent(Alignment)!.value !== AlignmentType.Player)
                return

            const unitCoord = entity.getComponent(Coordinate)!
            this.checkFieldOfView(unitCoord, 2)
        })

        this.queries.buildings.results.forEach(entity => {
            const coord = entity.getComponent(Coordinate)!
            this.checkFieldOfView(coord, 2)
        })
    }
}
