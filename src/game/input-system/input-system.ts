import { Not, Entity } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { RenderSystem } from '../test-stuff/render-system'
import { coordinateToXY, XYToCoordinate } from '../coordinate-system/omnipotent-coordinates'
import { Coordinate, coordinateStringHash } from '../coordinate-system/coordinate'
import { CoordinateSystem } from '../coordinate-system/coordinate-system'
import { Unit } from '../units/unit'
import { Selected } from './selected'
import { PersistentSystem } from '../../persistent-system'
import { Movement, moveSelectedEntity } from '../units/movement'
import { checkNeighbourCoordinates, pathfind } from '../pathfinding'
import { Alignment, AlignmentType } from '../units/alignment'
import { Position, Velocity } from '../components'
import { DamageTaken } from '../units/damage-taken'
import { Resource } from '../tiles/resource'
import { Carriage } from '../units/carriage'
import { Building } from '../tiles/building'

enum InputKey{
    Up,
    Down,
    Left,
    Right
}
// because of coordinate hijinks, these are actually like 90 degrees
const InputKeyCodes = new Map<number, InputKey>([
    [38, InputKey.Left],
    [40, InputKey.Right],
    [37, InputKey.Up],
    [39, InputKey.Down],

    [87, InputKey.Left],
    [83, InputKey.Right],
    [65, InputKey.Up],
    [68, InputKey.Down],
  ])


@registerWithPriority(92)
export class InputSystem extends PersistentSystem<{}> {
    static queries = {
    }
    renderer: RenderSystem
    moveDirection: any = { x: 0, y: 0 }
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
        //const direction = { x: 0, y: 0 }
        const code = evt.keyCode
        const moveSpeed = 3
        const inputMeaning = InputKeyCodes.get(code)


        // this could be normalized

        if (inputMeaning === InputKey.Left) {
            this.moveDirection.y = moveSpeed
        }
        else if (inputMeaning === InputKey.Right) {
            this.moveDirection.y = -moveSpeed
        }
        if (inputMeaning === InputKey.Up) {
            this.moveDirection.x = moveSpeed
        }
        else if (inputMeaning === InputKey.Down) {
            this.moveDirection.x = -moveSpeed
        }
    }

    resetKeyPress = (evt: KeyboardEvent) => {
        const code = evt.keyCode
        const inputMeaning = InputKeyCodes.get(code)
        if (inputMeaning !== InputKey.Down && inputMeaning !== InputKey.Up) {
            this.moveDirection.y = 0
        }
        if (inputMeaning !== InputKey.Left && inputMeaning !== InputKey.Right) {
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
        const clickedEntity = coordinateSystem.getUnitAt(coordinate)

        if (!clickedEntity) {
            this.handleNoClickedEntity(coordinateSystem, coordinate)
            return
        }
        const alignment = clickedEntity.getComponent(Alignment)!
        if (this.selectedEntity) {

            if (alignment.value === AlignmentType.Player && this.selectedEntity === clickedEntity) {
                this.unselectEntity(this.selectedEntity)
            } else if (alignment.value === AlignmentType.Player && this.selectedEntity !== clickedEntity) {
                this.unselectEntity(this.selectedEntity)
                this.selectEntity(clickedEntity)
            }
            if (alignment.value === AlignmentType.WildernessBeast) {
                moveSelectedEntity(this.world, coordinate, this.selectedEntity)
                this.unselectEntity(this.selectedEntity)                
            }
        }
        else if (clickedEntity) {
            this.lookForEntity(clickedEntity, coordinateSystem, coordinate, alignment.value)
        }
    }

    private handleNoClickedEntity(coordinateSystem: CoordinateSystem, coordinate: Coordinate) {
        if (this.selectedEntity) {
            moveSelectedEntity(this.world, coordinate, this.selectedEntity)
            this.unselectEntity(this.selectedEntity)                
        }
    }

    private lookForEntity(
        entity: Entity, coordinateSystem: CoordinateSystem, coordinate: Coordinate, alignment: AlignmentType) {
        if (alignment === AlignmentType.Player) {
            if (!entity.getComponent(Selected)) {
                this.selectEntity(entity)
            } else {
                this.unselectEntity(entity)
            }
        }
    }

    private selectEntity(entity: Entity) {
        entity.addComponent(Selected)
        this.selectedEntity = entity
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
