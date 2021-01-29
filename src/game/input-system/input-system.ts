/* @jsx h */
// @ts-ignore
import { h, render } from 'petit-dom'
import { System } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { Position, Velocity } from '../components'
import { RenderSystem } from '../test-stuff/render-system'
import { Game } from '../constants'
import { XYToCoordinate } from '../coordinate-system/omnipotent-coordinates'
import { Coordinate, coordinateEquals } from '../coordinate-system/coordinate'

// @registerWithPriority(4)
class InputSystem extends System {
    static queries = {
        units: { components: [Coordinate, Unit] }
    }

    init() {
        window.addEventListener('click', this.handleMouseClick)
    }

    handleMouseClick(evt: any) {
        const pixiRenderer = (this.world.getSystem(RenderSystem) as RenderSystem).getRenderer()
        const mouse = pixiRenderer.getMouseUiPosition()
        const gameMouse = pixiRenderer.convertToGameCoordinates(mouse)

        const coordinate = XYToCoordinate(gameMouse.x, gameMouse.y)

        this.queries.entities.results.forEach(entity => {
            const candidateCoordinate = entity.getComponent(Coordinate)!
            if (coordinateEquals(coordinate, candidateCoordinate)) {
                
            }
        }
    }

    execute(deltaTime: number, time: number) {


    }
}
