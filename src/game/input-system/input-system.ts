import { Not, Entity } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { RenderSystem } from '../test-stuff/render-system'
import { coordinateToXY, XYToCoordinate } from '../coordinate-system/omnipotent-coordinates'
import { Coordinate, coordinateStringHash } from '../coordinate-system/coordinate'
import { CoordinateSystem } from '../coordinate-system/coordinate-system'
import { partialMaxHealth, randomizeStrength, Unit } from '../units/unit'
import { Selected } from './selected'
import { PersistentSystem } from '../../persistent-system'
import { Movement } from '../units/movement'
import { checkNeighbourCoordinates, pathfind } from '../pathfinding'
import { Alignment, AlignmentType } from '../units/alignment'
import { Position, Velocity } from '../components'
import { DamageTaken } from '../units/damage-taken'
import { Resource } from '../tiles/resource'
import { Carriage } from '../units/carriage'
import { Building } from '../tiles/building'

@registerWithPriority(92)
export class InputSystem extends PersistentSystem<{}> {
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
        const moveSpeed = 3
        if (code === 38) {
            this.moveDirection.y = moveSpeed
        }
        else if (code === 40) {
            this.moveDirection.y = -moveSpeed
        }
        if (code === 37) {
            this.moveDirection.x = moveSpeed
        }
        else if (code === 39) {
            this.moveDirection.x = -moveSpeed
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
        const clickedEntity = coordinateSystem.getUnitAt(coordinate)

        if (!clickedEntity) {
            this.handleNoClickedEntity(coordinateSystem, coordinate)
            return
        }
        const alignment = clickedEntity.getComponent(Alignment)!
        if (this.selectedEntity) {

            if (alignment.value === AlignmentType.Player && this.selectedEntity === clickedEntity){
                this.unselectEntity(this.selectedEntity)
            }
            if (alignment.value === AlignmentType.Player && this.selectedEntity !== clickedEntity) {
                this.unselectEntity(this.selectedEntity)
                this.selectEntity(clickedEntity)
            }
            if (alignment.value === AlignmentType.WildernessBeast) {
                this.moveSelectedEntity(coordinateSystem, coordinate, this.selectedEntity)
            }
        }
        else if (clickedEntity ) {
            this.lookForEntity(clickedEntity, coordinateSystem, coordinate, alignment.value)
        }
    }

    private handleNoClickedEntity(coordinateSystem: CoordinateSystem, coordinate: Coordinate) {
        if (this.selectedEntity) {
            this.moveSelectedEntity(coordinateSystem, coordinate, this.selectedEntity)
        }
    }

    private moveSelectedEntity(coordinateSystem: CoordinateSystem,
        coordinate: Coordinate,
        entity: Entity) {
        const moverAlignment = entity.getComponent(Alignment)!
        const tileEntity = coordinateSystem.getTileAt(coordinate)
        if (tileEntity) {
            const unitCoordinate = entity.getMutableComponent(Coordinate)!
            const movement = entity.getMutableComponent(Movement)
            if (!movement || movement.movementPoints === 0) {
                return
            }
            const coordSystem = this.world.getSystem(CoordinateSystem)
            const passableCallback = coordSystem.isPassable.bind(coordSystem)

            const path = pathfind(unitCoordinate, coordinate, passableCallback)
            if (!path || path.length === 0){
                return
            }
            path.splice(0, 1)

            let step = 0
            while (movement.movementPoints > 0 && step < path.length) {
                if (entity.getComponent(Unit)!.health <= 0) {
                    return
                }
                const stepFromPath = path[step]
                unitCoordinate.x = stepFromPath.x
                unitCoordinate.y = stepFromPath.y
                unitCoordinate.z = stepFromPath.z
                movement.movementPoints--
                step++
                const fightNearby = (fightCoordinate: Coordinate) => {
                    if (entity.getComponent(Unit)!.health <= 0) {
                        return true
                    }
                    const possibleTarget = coordinateSystem.getUnitAt(fightCoordinate)
                    if (possibleTarget && possibleTarget.getComponent(Alignment)?.value !== moverAlignment.value) {
                        this.fight(entity, possibleTarget)
                        movement.movementPoints = 0
                        return true
                    }
                    return true
                }
                if (entity.getComponent(Unit)!.health <= 0) {
                    return true
                }
                checkNeighbourCoordinates(unitCoordinate, fightNearby)

                const carriage = entity.getMutableComponent(Carriage)
                const tileStepped = coordinateSystem.getTileAt(stepFromPath)!
                if (carriage && !carriage.value){
                    const possibleResource = tileStepped.getComponent(Resource)
                    if (possibleResource) {
                        carriage.value = possibleResource.resource
                        tileStepped.removeComponent(Resource)
                    }
                }
                const house = tileStepped.getMutableComponent(Building)
                if (house && carriage && carriage.value) {
                    house.containedResources++
                    carriage.value = null
                }
            }

            this.unselectEntity(entity)
        }
    }

    private fight(fighter: Entity, secondFighter: Entity) {
        const unit = fighter.getMutableComponent(Unit)!
        const secondUnit = secondFighter.getMutableComponent(Unit)!
        const firstStrength = randomizeStrength(unit)
        const secondStrength = randomizeStrength(secondUnit)
        const fullHealthLoss = partialMaxHealth(unit) + partialMaxHealth(secondUnit)
        const fullStrength = firstStrength + secondStrength
        this.dealDamage(unit, fighter, secondStrength / fullStrength * fullHealthLoss)
        this.dealDamage(secondUnit, secondFighter, firstStrength / fullStrength * fullHealthLoss)
    }

    private dealDamage(unit: Unit, entity: Entity, damageAmount: number) {
        unit.health -= damageAmount
        const coordinate = entity.getComponent(Coordinate)!
        const position = coordinateToXY(coordinate)
        const damagee = this.world.createEntity()
        damagee.addComponent(Position, position)
        damagee.addComponent(Velocity, { x: 0, y: -20 })
        damagee.addComponent(DamageTaken, { value: damageAmount })
    }

    private lookForEntity(
        entity: Entity, coordinateSystem: CoordinateSystem, coordinate: Coordinate, alignment: AlignmentType) {
        if(alignment === AlignmentType.Player) {
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
