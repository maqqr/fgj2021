import { System } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { AnimatedPosition } from '../components'
import { Coordinate } from '../coordinate-system/coordinate'
import { coordinateToXY } from '../coordinate-system/omnipotent-coordinates'
import { Unit } from './unit'

@registerWithPriority(95)
export class UnitAnimationSystem extends System {
    static queries = {
        units: { components: [Unit, Coordinate, AnimatedPosition] },
    }

    execute(delta: number, time: number): void {
        this.queries.units.results.forEach(entity => {
            const coord = entity.getComponent(Coordinate)!

            delta = Math.max(0.02, delta)

            const targetPos = coordinateToXY(coord)
            const currentPos = entity.getMutableComponent(AnimatedPosition)!
            currentPos.x += (targetPos.x - currentPos.x) * 2 * delta
            currentPos.y += (targetPos.y - currentPos.y) * 2 * delta
        })
    }
}
