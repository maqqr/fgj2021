/* @jsx h */
// @ts-ignore
import { h, render } from 'petit-dom'
import { System } from 'ecsy'
import { registerWithPriority } from '../../register-system'
import { Position, Velocity } from '../components'
import { Player } from './example-components'
import { RenderSystem } from './render-system'
import { Game } from '../constants'
import { TurnEntityName } from '../turns/turn-system'
import { TurnEndOrder } from '../turns/turn-count'

@registerWithPriority(4)
class GUITestSystem extends System {
    static queries = {
        players: { components: [Player, Position] },
        withPosition: { components: [Position] }
    }

    onSpawnButtonClicked(evt: any) {
        const rnd = () => (Math.random() - 0.5) * 2.0
        const newEntity = this.world.createEntity()
        newEntity.addComponent(Position, { x: Game.width / 2, y: Game.height / 2 })
        newEntity.addComponent(Velocity, { x: rnd() * 60, y: rnd() * 60 })
        newEntity.addComponent(Player)
    }

    onEndTurnClicked(evt: MouseEvent) {
        const turnEntity = this.world.entityManager.getEntityByName(TurnEntityName)
        if (turnEntity && !turnEntity.getComponent(TurnEndOrder))
            turnEntity.addComponent(TurnEndOrder)
    }

    execute(deltaTime: number, time: number) {
        const progressBarFillPercentage = Math.floor(((Math.sin(time) * 0.5) + 0.5) * 100)

        const pixiRenderer = this.world.getSystem(RenderSystem).getRenderer()
        const mouse = pixiRenderer.getMouseUiPosition()
        const gameMouse = pixiRenderer.convertToGameCoordinates(mouse)

        const viewportRect = pixiRenderer.getViewportRect()
        const windowUiPos = pixiRenderer.convertToUICoordinates({x: 10, y: 10 })
        const windowStyle = `left:${windowUiPos.x}px; top:${windowUiPos.y}px; width:${viewportRect.width*0.5}px`

        // Reusable UI component. Works just like React Functional Components.
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

        const uiWindow =
            <div class="rpgui-container framed" style={windowStyle as any}>
                <h1>UI Test</h1>
                <p>Time: {""+time.toFixed(2)}</p>
                <p>Mouse UI coordinate: ({""+Math.floor(mouse.x)}, {""+Math.floor(mouse.y)})</p>
                <p>Mouse Game coordinate: ({""+Math.floor(gameMouse.x)}, {""+Math.floor(gameMouse.y)})</p>
                <hr/>
                <p>Entities with Player and Position components: {""+this.queries.players.results.length}</p>
                <div class="rpgui-container framed-grey" style={"overflow-y: scroll; height: 200px" as any}>
                    <p>List of entities:</p>
                    <ul class="rpgui-list">
                        {
                        this.queries.players.results.map(entity => {
                            const pos = entity.getComponent(Position)!
                            return <li>player ({""+Math.floor(pos.x)}, {""+Math.floor(pos.y)})</li>
                        })
                        }
                    </ul>
                </div>
                <p>Progress bars:</p>
                <ProgressBar percentage={progressBarFillPercentage}></ProgressBar>
                <ProgressBar percentage={100 - progressBarFillPercentage}></ProgressBar>

                <hr/>
                <div class="rpgui-center">
                    <button class="rpgui-button" style={"padding: 0px 100px" as any}
                            onclick={this.onSpawnButtonClicked.bind(this)}>Spawn</button>
                </div>
            </div>

        const positionTextsOnTopOnEntities =
            <div>
                {
                this.queries.withPosition.results.map(entity => {
                    const pos = entity.getComponent(Position)!
                    const uiPosition = pixiRenderer.convertToUICoordinates(pos)
                    const textStyle = `z-index:-10; position:fixed; left:${uiPosition.x}px; top:${uiPosition.y}px;`
                                    + `transform: translate(-50%, -50%)`
                    return <span style={textStyle as any}>{`(${Math.floor(pos.x)}, ${Math.floor(pos.y)})`}</span>
                })
                }
            </div>

        const endTurnButton =
            <div class="rpgui-container framed end-turn framed-grey" onclick={
                (evt: MouseEvent) => this.onEndTurnClicked(evt)}>
                <span>
                    End turn
                </span>
            </div>

        const finalUi =
            <div>
                {/* {uiWindow} */}
                {/* {positionTextsOnTopOnEntities} */}
                {endTurnButton}
            </div>

        const uiContainer = document.getElementById("ui")
        render(finalUi, uiContainer!) // render is petit-dom function that changes the contents of the ui container
    }
}
