import { Not, System } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { RenderSystem } from '../test-stuff/render-system'
import { XYToCoordinate } from '../coordinate-system/omnipotent-coordinates'
import { Coordinate } from '../coordinate-system/coordinate'
import { CoordinateSystem } from '../coordinate-system/coordinate-system'
import { Unit } from '../units/unit'
import { Selected } from './selected'

@registerWithPriority(92)
class InputSystem extends System {
    static queries = {
        units: { components: [Coordinate, Unit, Not(Selected)] }
    }

    init() {
        window.addEventListener('click', (evt: any) => this.handleMouseClick(evt))
    }

    handleMouseClick = (evt: any) => {
        const pixiRenderer = (this.world.getSystem(RenderSystem) as RenderSystem).getRenderer()
        const mouse = pixiRenderer.getMouseUiPosition()
        const gameMouse = pixiRenderer.convertToGameCoordinates(mouse)

        const coordinate = XYToCoordinate(gameMouse.x, gameMouse.y)
        const coordinateSystem = this.world.getSystem(CoordinateSystem)
        const entity = coordinateSystem.getUnitAt(coordinate)!

        if (entity && !entity.getComponent(Selected)) {
            entity.addComponent(Selected)
        }
    }

    execute(delta: number, time: number): void {
        //
    }
}
