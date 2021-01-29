import { World, System, Entity } from 'ecsy'
import { Position, Velocity } from '../components'
import { getPrioritySystems, registerWithPriority } from '../../register-system'
import { Game } from '../constants'

@registerWithPriority(2)
class MovementSystem extends System {
    static queries = {
        entities: { components: [Position, Velocity] }
    }

    execute(deltaTime: number, time: number) {
        this.queries.entities.results.forEach(entity => {
            const velocity = entity.getComponent(Velocity)!
            const position = entity.getMutableComponent(Position)!

            position.x += velocity.x * deltaTime
            position.y += velocity.y * deltaTime

            if (position.x < 0 && velocity.x < 0) {
                position.x = Game.width
            }
            if (position.x > Game.width && velocity.x > 0) {
                position.x = 0
            }
            if (position.y < 0 && velocity.y < 0) {
                position.y = Game.height
            }
            if (position.y > Game.height && velocity.y > 0) {
                position.y = 0
            }
        })
    }
}