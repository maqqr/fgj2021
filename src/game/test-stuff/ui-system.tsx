/* @jsx h */
// @ts-ignore
import { h, render } from 'petit-dom'
import { System } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { AnimatedPosition, Camera, Position, Velocity } from '../components'
import { Player } from './example-components'
import { RenderSystem } from './render-system'
import { Game } from '../constants'
import { TurnEntityName } from '../turns/turn-system'
import { TurnEndOrder } from '../turns/turn-count'
import { Coordinate } from '../coordinate-system/coordinate'
import { CoordinateSystem } from '../coordinate-system/coordinate-system'
import { coordinateToXY, TileWidth, XYToCoordinate } from '../coordinate-system/omnipotent-coordinates'
import { Movement } from '../units/movement'
import { makeSoldier, makeWorker, Unit } from '../units/unit'
import { Resource, resourceTypeToString } from '../tiles/resource'
import { Building } from '../tiles/building'
import { DamageTaken } from '../units/damage-taken'
import { Carriage } from '../units/carriage'
import { Alignment, AlignmentType } from '../units/alignment'

@registerWithPriority(4)
export class GUITestSystem extends System {
    static queries = {
        players: { components: [Player, Position] },
        withPosition: { components: [Position] },
        damage: { components: [DamageTaken, Position] },
        units: { components: [Coordinate, Unit, Alignment] }
    }

    canBuyUnit(): boolean {
        const originTile = this.world.getSystem(CoordinateSystem).getTileAt(new Coordinate({x: 0, y: 0, z: 0}))
        const building = originTile?.getMutableComponent(Building)
        return building !== undefined && building.containedResources > 0
    }

    buyUnit() {
        const originTile = this.world.getSystem(CoordinateSystem).getTileAt(new Coordinate({x: 0, y: 0, z: 0}))
        const building = originTile?.getMutableComponent(Building)

        if (building && building.containedResources > 0) {
            building.containedResources--
        }
    }

    onSpawnWorker(evt: any) {
        if (this.canBuyUnit()) {
            this.buyUnit()
            const newEntity = this.world.createEntity()
            newEntity.addComponent(Coordinate, {x: 0, y: 0, z: 0})
            newEntity.addComponent(Unit, makeWorker())
            newEntity.addComponent(Movement, { movementPoints: 3, movementPointsMaximum: 3 })
            newEntity.addComponent(Alignment, { value: AlignmentType.Player })
            newEntity.addComponent(AnimatedPosition)
            newEntity.addComponent(Carriage, { value: null })
        }
    }

    onSpawnSoldier(evt: any) {
        if (this.canBuyUnit()) {
            this.buyUnit()
            const newEntity = this.world.createEntity()
            newEntity.addComponent(Coordinate, {x: 0, y: 0, z: 0})
            newEntity.addComponent(Unit, makeSoldier())
            newEntity.addComponent(Movement, { movementPoints: 3, movementPointsMaximum: 3 })
            newEntity.addComponent(Alignment, { value: AlignmentType.Player })
            newEntity.addComponent(AnimatedPosition)
        }
    }

    onEndTurnClicked(evt: MouseEvent) {
        const turnEntity = this.world.entityManager.getEntityByName(TurnEntityName)
        if (turnEntity && !turnEntity.getComponent(TurnEndOrder))
            turnEntity.addComponent(TurnEndOrder)
    }

    makeInfoWindow() {
        const renderSystem = this.world.getSystem(RenderSystem)
        const pixiRenderer = renderSystem.getRenderer()
        const viewportRect = pixiRenderer.getViewportRect()

        // Lots of copypaste sin here.
        const mouse = pixiRenderer.convertToGameCoordinates(pixiRenderer.getMouseUiPosition())
        const camera = renderSystem.getCamera()
        const mouseHex = XYToCoordinate(mouse.x - camera.x, mouse.y - camera.y, TileWidth)

        const infoWindowUiPos = pixiRenderer.convertToUICoordinates({x: 10, y: 10 })
        const infoWindowStyle = `left:30px; bottom:30px; width:${viewportRect.width*0.3}px`

        // if (mouse.x < Game.width * 0.4) {
        //     infoWindowStyle =
        //       `right:${infoWindowUiPos.x}px; bottom:${infoWindowUiPos.y}px; width:${viewportRect.width*0.3}px`
        // }
        // else {
        //     infoWindowStyle =
        //       `left:${infoWindowUiPos.x}px; bottom:${infoWindowUiPos.y}px; width:${viewportRect.width*0.3}px`
        // }

        const ProgressBar = (props: { percentage: number }) => {
            return (
                <div class="rpgui-progress">
                    <div class="rpgui-progress-track">
                        <div class="rpgui-progress-track">
                            <div class="rpgui-progress-fill red"
                                 style={"left: 0px; width: "+props.percentage+"%;" as any}>
                            </div>
                        </div>
                        <div class="rpgui-progress-left-edge"></div>
                        <div class="rpgui-progress-right-edge"></div>
                    </div>
                </div>
            )
        }

        const allInfos: any = []

        // Get info from unit
        const unitEntity = this.world.getSystem(CoordinateSystem).getUnitAt(mouseHex)
        if (unitEntity) {
            const unit = unitEntity.getComponent(Unit)!
            const movement = unitEntity.getComponent(Movement)!
            const resource = unitEntity.getComponent(Carriage)
            allInfos.push(
                <div>
                    <h1>{unit.name}</h1>
                    <ProgressBar percentage={Math.floor((unit.health / unit.maxHealth) * 100)}></ProgressBar>
                    <p>Health: {""+Math.floor(unit.health)} / {""+Math.floor(unit.maxHealth)}</p>
                    <p>Strength: {""+unit.strength}</p>
                    <p>Movement: {""+movement.movementPoints} / {""+movement.movementPointsMaximum}</p>
                    { resource && resource.value ?
                        <p>Carrying: {""+resourceTypeToString(resource.value)}</p> :
                        <div></div> }
                </div>
            )
            allInfos.push(<hr></hr>)
        }

        // Get infos from tile
        const tileEntity = this.world.getSystem(CoordinateSystem).getTileAt(mouseHex)
        if (tileEntity) {
            const resource = tileEntity.getComponent(Resource)
            if (resource) {
                allInfos.push(
                    <div>
                        <h1>Resource: {resourceTypeToString(resource.resource)}</h1>
                    </div>
                )
                allInfos.push(<hr></hr>)
            }

            const building = tileEntity.getComponent(Building)
            if (building) {
                allInfos.push(
                    <div>
                        <h1>Building</h1>
                        <p>Resources: {""+building.containedResources}</p>
                    </div>
                )
                allInfos.push(<hr></hr>)
            }
        }

        if (allInfos.length > 0) {
            // Splice the last <hr> out
            allInfos.splice(allInfos.length - 1, 1)

            return (
                <div class="rpgui-container framed" style={infoWindowStyle as any}>
                    {allInfos}
                </div>
            )
        }
        else {
            return <div class="rpgui-container" style={"display: none;" as any}></div>
        }
    }

    execute(deltaTime: number, time: number) {
        const pixiRenderer = this.world.getSystem(RenderSystem).getRenderer()

        const camera = this.world.getSystem(RenderSystem).getCamera()
        const damageTexts =
            <div>
                {
                this.queries.damage.results.map(entity => {
                    const pos = entity.getComponent(Position)!
                    const damage = entity.getComponent(DamageTaken)!
                    const cameraFix = { x: pos.x + camera.x, y: pos.y + camera.y }
                    const uiPosition = pixiRenderer.convertToUICoordinates(cameraFix)
                    const textStyle = `z-index:-10; position:fixed; left:${uiPosition.x}px; top:${uiPosition.y}px;`
                                    + `transform: translate(-50%, -50%); color: lightcoral`
                    return <span style={textStyle as any}>{`-${Math.floor(damage.value)}`}</span>
                })
                }
            </div>

        const nameTexts =
            <div>
                {
                this.queries.units.results.map(entity => {
                    const alignment = entity.getComponent(Alignment)!
                    if (alignment.value === AlignmentType.Player) {
                        const pos = coordinateToXY(entity.getComponent(Coordinate)!)
                        pos.y += 25
                        const unit = entity.getComponent(Unit)!
                        const cameraFix = { x: pos.x + camera.x, y: pos.y + camera.y }
                        const uiPosition = pixiRenderer.convertToUICoordinates(cameraFix)
                        const textStyle = `z-index:-10; position:fixed; left:${uiPosition.x}px; top:${uiPosition.y}px;`
                                        + `transform: translate(-50%, -50%); color: white`
                        return <span style={textStyle as any}>{unit.name}</span>
                    }
                    else {
                        return <div></div>
                    }
                })
                }
            </div>

        const infoWindow = this.makeInfoWindow()

        const endTurnStyle = `z-index:-10; position:fixed; right:15px; bottom:15px;`
        const endTurnButton =
            <div class="rpgui-container framed framed-golden" style={endTurnStyle as any} onclick={
                (evt: MouseEvent) => this.onEndTurnClicked(evt)}>
                <span>
                    End turn
                </span>
            </div>

        const buyButtonStyle = `z-index:-10; position:fixed; right:15px; top:15px;`
        const buyButton =
            <div class="rpgui-container" style={buyButtonStyle as any}>
                <div class="rpgui-center">
                    <button class="rpgui-button" disabled={!this.canBuyUnit()}
                        style={"padding: 0px 30px; width: 250px" as any}
                        onclick={this.onSpawnWorker.bind(this)}>Buy worker</button>
                </div>

                <div class="rpgui-center">
                    <button class="rpgui-button" disabled={!this.canBuyUnit()}
                        style={"padding: 0px 30px; width: 250px" as any}
                        onclick={this.onSpawnSoldier.bind(this)}>Buy soldier</button>
                </div>
            </div>

        const finalUi =
            <div>
                {/* {uiWindow} */}
                {nameTexts}
                {damageTexts}
                {infoWindow}
                {endTurnButton}
                {buyButton}
            </div>

        const uiContainer = document.getElementById("ui")
        render(finalUi, uiContainer!) // render is petit-dom function that changes the contents of the ui container
    }
}
