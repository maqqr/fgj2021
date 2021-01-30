import { World, System, Entity } from 'ecsy'
import { Position, Velocity } from './components'
import { getPrioritySystems, registerWithPriority } from '../register-system'
import { Game } from './constants'

// All systems in other files must be included here to be compiled
import './test-stuff/render-system'
import './test-stuff/ui-system'
import './coordinate-system/coordinate-system'
import './fog-of-war/fow-system'
import { DamageTaken } from './units/damage-taken'
import './units/enemy-movement-system'

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
        entities: { components: [Position, Velocity, DamageTaken] }
    }

    execute(deltaTime: number, time: number) {
        this.queries.entities.results.forEach(entity => {
            const velocity = entity.getMutableComponent(Velocity)!
            const position = entity.getMutableComponent(Position)!

            velocity.x += -velocity.x * deltaTime
            velocity.y += -velocity.y * deltaTime

            position.x += velocity.x * deltaTime
            position.y += velocity.y * deltaTime

            if (Math.abs(velocity.x) < 0.3 && Math.abs(velocity.y) < 0.3) {
                entity.remove()
            }
        })
    }
}
