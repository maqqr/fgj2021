import { World, System, Entity } from 'ecsy'
import { Position, Velocity } from './components'
import { getPrioritySystems, registerWithPriority } from '../register-system'
import { Game } from './constants'

// All systems in other files must be included here to be compiled
import './units/unit-animation-system'
import './test-stuff/render-system'
import { GUITestSystem } from './test-stuff/ui-system'
import './coordinate-system/coordinate-system'
import './fog-of-war/fow-system'
import { DamageTaken } from './units/damage-taken'
import './units/enemy-movement-system'
import { CoordinateSystem } from './coordinate-system/coordinate-system'
import { RenderSystem } from './test-stuff/render-system'
import { TurnSystem } from './turns/turn-system'
import { InputSystem } from './input-system/input-system'
import { MovementResetSystem } from './units/movement-reset-system'
import { TurnSystemCleanUp } from './turns/turn-system-clean-up'
import { UnitHealthSystem } from './units/unit-health-system'
import { UnitAnimationSystem } from './units/unit-animation-system'
import { FogOfWarSystem } from './fog-of-war/fow-system'
import { EnemyMovementSystem } from './units/enemy-movement-system'

export function registerSystems(world: World): void {
    // Register all @registerWithPriority systems
    // for (const { priority, systemConstructor } of getPrioritySystems()) {
    //     world.registerSystem(systemConstructor, { priority })
    //     console.log(`world.registerSystem(${systemConstructor.name}, {priority:${priority}})`)
    // }

    world.registerSystem(CoordinateSystem, {priority:1})
    world.registerSystem(TurnSystem, {priority:2})
    world.registerSystem(RenderSystem, {priority:100})
    world.registerSystem(InputSystem, {priority:92})
    world.registerSystem(MovementResetSystem, {priority:5})
    world.registerSystem(TurnSystemCleanUp, {priority:10000})
    world.registerSystem(UnitHealthSystem, {priority:80})
    world.registerSystem(UnitAnimationSystem, {priority:95})
    world.registerSystem(GUITestSystem, {priority:4})
    world.registerSystem(FogOfWarSystem, {priority:80})
    world.registerSystem(EnemyMovementSystem, {priority:3})
    world.registerSystem(MovementSystem, {priority:2})

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
