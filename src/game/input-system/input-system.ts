import { Not } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { RenderSystem } from '../test-stuff/render-system'
import { XYToCoordinate } from '../coordinate-system/omnipotent-coordinates'
import { Coordinate } from '../coordinate-system/coordinate'
import { CoordinateSystem } from '../coordinate-system/coordinate-system'
import { Unit } from '../units/unit'
import { Selected } from './selected'
import { PersistentSystem } from '../../persistent-system'

@registerWithPriority(92)
class InputSystem extends PersistentSystem<{}> {
    static queries = {
        units: { components: [Coordinate, Unit, Not(Selected)] }
    }
    renderer: RenderSystem
    moveDirection: any = {x: 0, y: 0}
    cameraSpeed = 100

    onClickListener: EventListener
    onKeydownListener: EventListener
    onKeyupListener: EventListener

    initialize() {
        this.renderer = this.world.getSystem(RenderSystem) as RenderSystem
        this.onClickListener = this.handleMouseClick.bind(this)
        this.onKeydownListener = this.handleKeyPress.bind(this)
        this.onKeyupListener = this.resetKeyPress.bind(this)
        window.addEventListener('click', this.onClickListener)
        window.addEventListener('keydown', this.onKeydownListener)
        window.addEventListener('keyup', this.onKeyupListener)
    }

    initializeState() {
        this.initialize()
    }

    restoreState(state: {}) {
        this.initialize()
    }

    dumpState() {
        window.removeEventListener('click', this.onClickListener)
        window.removeEventListener('keydown', this.onKeydownListener)
        window.removeEventListener('keyup', this.onKeyupListener)
        return {}
    }

    handleKeyPress = (evt: KeyboardEvent) => {
        const direction = {x: 0, y: 0}
        const code = evt.keyCode
        if (code === 38) {
            this.moveDirection.y = 1
        }
        else if (code === 40) {
            this.moveDirection.y = -1
        }
        if (code === 37) {
            this.moveDirection.x = 1
        }
        else if (code === 39) {
            this.moveDirection.x = -1
        }
    }

    resetKeyPress = (evt: KeyboardEvent) => {
        const code = evt.keyCode
        if (code === 38 || code === 40) {
            this.moveDirection.y = 0
        }
        if (code === 37 || code === 39) {
            this.moveDirection.x = 0
        }
    }

    handleMouseClick = (evt: any) => {
        const pixiRenderer = this.renderer.getRenderer()
        const mouse = pixiRenderer.getMouseUiPosition()
        const gameMouse = pixiRenderer.convertToGameCoordinates(mouse)

        const coordinate = XYToCoordinate(gameMouse.x - this.renderer.cameraX, gameMouse.y - this.renderer.cameraY)
        const coordinateSystem = this.world.getSystem(CoordinateSystem)
        const entity = coordinateSystem.getUnitAt(coordinate)!

        if (entity) {
            if(!entity.getComponent(Selected)) {
                entity.addComponent(Selected)
            } else {
                entity.removeComponent(Selected)
            }
        }
    }

    execute(delta: number, time: number): void {
        if (this.moveDirection.x !== 0 || this.moveDirection.y !== 0) {
            this.renderer.moveCamera(this.moveDirection, this.cameraSpeed * delta)
        }
    }
}
