import { World, System, Entity } from 'ecsy'
import { Position, Velocity } from '../components'
import { getPrioritySystems, registerWithPriority } from '../../register-system'
import { Game } from '../constants'
import { Coordinate } from '../coordinate-system/coordinate'

@registerWithPriority(1)
class TileSystem extends System {

    private tileCache: { [id: string]: Entity }

    static queries = {
        tiles: { components: [Coordinate] }
    }

    private positionHash(coord: Coordinate): string {
        return "" + coord.x + "," + coord.y + "," + coord.z
    }

    execute(deltaTime: number, time: number) {
        this.queries.tiles.results.forEach(entity => {
            const coord = entity.getComponent(Coordinate)!
            this.tileCache[this.positionHash(coord)] = entity
        })
    }

    getTileAt(coord: Coordinate): Entity | null {
        return this.tileCache[this.positionHash(coord)]
    }
}
