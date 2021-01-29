import { World, System, Entity } from 'ecsy'
import { Position, Velocity } from './components'
import { getPrioritySystems, registerWithPriority } from '../register-system'
import { Game } from './constants'

// All systems in other files must be included here to be compiled
import './test-stuff/render-system'
import './test-stuff/ui-system'
import './coordinate-system/coordinate-system'

export function registerSystems(world: World): void {
    // Register all @registerWithPriority systems
    for (const { priority, systemConstructor } of getPrioritySystems()) {
        world.registerSystem(systemConstructor, { priority })
        console.log("Registered system " + systemConstructor.name + " with priority " + priority)
    }
}

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
