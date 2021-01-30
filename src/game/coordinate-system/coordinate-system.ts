import { Entity, System } from "ecsy"
import { registerWithPriority } from "../../register-system"
import { Tile, TileType } from "../tiles/tile"
import { Unit } from "../units/unit"
import { Coordinate, coordinateHash } from "./coordinate"

@registerWithPriority(1)
export class CoordinateSystem extends System {

    private tileCache: { [id: string]: Entity } | null = null
    private unitCache: { [id: string]: Entity }

    static queries = {
        tiles: {
            components: [Coordinate, Tile],
            listen: {
                added: true,
                removed: true
            }
        },

        units: { components: [Coordinate, Unit] }
    }

    private positionHash(coord: Coordinate): string {
        // return coordinateHash(coord)
        return "" + coord.x + "," + coord.y + "," + coord
    }

    execute(deltaTime: number, time: number) {
        // Invalidate tile cache when tile entities are created/removed
        this.queries.tiles.added!.forEach(entity => {
            this.tileCache = null
        })
        this.queries.tiles.removed!.forEach(entity => {
            this.tileCache = null
        })

        // Rebuild tile cache if needed
        if (!this.tileCache) {
            this.tileCache = {}
            this.queries.tiles.results.forEach(entity => {
                const coord = entity.getComponent(Coordinate)!
                this.tileCache![this.positionHash(coord)] = entity
            })
        }

        // Unit cache is updated every frame for now
        this.unitCache = {}
        this.queries.units.results.forEach(entity => {
            const coord = entity.getComponent(Coordinate)!
            this.unitCache[this.positionHash(coord)] = entity
        })
    }

    getTileAt(coord: Coordinate): Entity | null {
        if (!this.tileCache) {
            console.error("Tried to access tile position before TileSystem.tileCache was refreshed")
            return null
        } else {
            return this.tileCache[this.positionHash(coord)] ?? null
        }
    }

    getUnitAt(coord: Coordinate): Entity | null {
        return this.unitCache[this.positionHash(coord)] ?? null
    }

    isPassable(coord: Coordinate): boolean {
        const tileEntity = this.getTileAt(coord)
        if (!tileEntity) {
            return false
        }

        const tile = tileEntity.getComponent(Tile)!
        return tile.tileType !== TileType.Mountain
    }
}
