import { World, System, Entity } from 'ecsy'
import { Position, Velocity } from '../components'
import { getPrioritySystems, registerWithPriority } from '../../register-system'
import { Game } from '../constants'
import { Coordinate } from '../coordinate-system/coordinate'
import { Tile } from './tile'

@registerWithPriority(1)
class TileSystem extends System {

    private tileCache: { [id: string]: Entity } | null = null

    static queries = {
        tiles: {
            components: [Coordinate, Tile],
            listen: {
                added: true,
                removed: true
            }
        }
    }

    private positionHash(coord: Coordinate): string {
        return "" + coord.x + "," + coord.y + "," + coord.z
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
    }

    getTileAt(coord: Coordinate): Entity | null {
        if (!this.tileCache) {
            console.error("Tried to access tile position before TileSystem.tileCache was refreshed")
            return null
        } else {
            return this.tileCache[this.positionHash(coord)]
        }
    }
}
