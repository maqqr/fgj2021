import { Not, Entity } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { RenderSystem } from '../test-stuff/render-system'
import { XYToCoordinate } from '../coordinate-system/omnipotent-coordinates'
import { Coordinate } from '../coordinate-system/coordinate'
import { CoordinateSystem } from '../coordinate-system/coordinate-system'
import { Unit } from '../units/unit'
import { Selected } from './selected'
import { PersistentSystem } from '../../persistent-system'
import { Movement } from '../units/movement'

@registerWithPriority(92)
class InputSystem extends PersistentSystem<{}> {
    static queries = {
    }
    renderer: RenderSystem
    moveDirection: any = {x: 0, y: 0}
    cameraSpeed = 100
    selectedEntity: Entity | null = null

    onClickListener: EventListener
    onKeydownListener: EventListener
    onKeyupListener: EventListener

    initialize() {
        this.renderer = this.world.getSystem(RenderSystem)
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

    handleMouseClick = (evt: MouseEvent) => {
        const pixiRenderer = this.renderer.getRenderer()
        const mouse = pixiRenderer.getMouseUiPosition()
        const gameMouse = pixiRenderer.convertToGameCoordinates(mouse)

        const camera = this.renderer.getCamera()
        const coordinate = XYToCoordinate(gameMouse.x - camera.x, gameMouse.y - camera.y)
        const coordinateSystem = this.world.getSystem(CoordinateSystem)
        const entity = coordinateSystem.getUnitAt(coordinate)

        if (entity !== this.selectedEntity && this.selectedEntity) {
            this.moveSelectedEntity(coordinateSystem, coordinate, this.selectedEntity)
        }
        else if (entity) {
            this.lookForEntity(entity, coordinateSystem, coordinate)
        }
    }

    private moveSelectedEntity(coordinateSystem: CoordinateSystem, coordinate: Coordinate, entity: Entity) {
        const tileEntity = coordinateSystem.getTileAt(coordinate)
        if (tileEntity) {
            const unitCoordinate = entity.getMutableComponent(Coordinate)!
            const movement = entity.getMutableComponent(Movement)
            if (!movement || movement.movementPoints === 0) {
                return
            }
            unitCoordinate.x = coordinate.x
            unitCoordinate.y = coordinate.y
            unitCoordinate.z = coordinate.z
            movement.movementPoints--

            this.unselectEntity(entity)
        }
    }

    private lookForEntity(entity: Entity, coordinateSystem: CoordinateSystem, coordinate: Coordinate) {
        if (entity) {
            if (!entity.getComponent(Selected)) {
                entity.addComponent(Selected)
                this.selectedEntity = entity
            } else {
                this.unselectEntity(entity)
            }
        }
    }

    private unselectEntity(entity: Entity) {
        entity.removeComponent(Selected)
        this.selectedEntity = null
    }

    execute(delta: number, time: number): void {
        if (this.moveDirection.x !== 0 || this.moveDirection.y !== 0) {
            this.renderer.moveCamera(this.moveDirection, this.cameraSpeed * delta)
        }
    }
}
