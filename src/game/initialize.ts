import { World } from 'ecsy'
import { Position, Velocity } from './components'
import { Player } from './test-stuff/example-components'

export function initializeEntities(world: World) {
    // Create one player entity
    const playerEntity = world.createEntity()
    playerEntity.addComponent(Player)
    playerEntity.addComponent(Position)
    playerEntity.addComponent(Velocity, { x: 1, y: 2 })

    // Returns number between [-1.0, 1.0]
    const rnd = () => (Math.random() - 0.5) * 2.0

    // Create random entities without Player component
    for (let i = 0; i < 5; i++) {
        const randomBall = world.createEntity()
        randomBall.addComponent(Position, { x: Math.random() * 800, y: Math.random() * 600 })
        randomBall.addComponent(Velocity, { x: rnd() * 60, y: rnd() * 60 })
    }
}
