import { PixiRenderer } from '../../pixirenderer'
import { PersistentSystem } from '../../persistent-system'
import { Color } from '../color'
import { Position } from '../components'
import { registerWithPriority } from '../../register-system'
import { Not } from 'ecsy'
import { Player } from "./example-components"
import { Game } from '../constants'
import { Coordinate } from '../coordinate-system/coordinate'
import { coordinateToXY, TileWidth } from '../coordinate-system/omnipotent-coordinates'

type RenderSystemState = { renderer: PixiRenderer }

@registerWithPriority(100)
export class RenderSystem extends PersistentSystem<RenderSystemState> {
    static queries = {
        players: { components: [Position, Player] },
        notPlayers: { components: [Position, Not(Player)] },
        coordinates: { components: [Coordinate] }
    }

    initializeState() {
        const renderer = new PixiRenderer(Game.width, Game.height)
        renderer.initialize()
        renderer.loadTextures(["test.png", "tile.png"])


        window.addEventListener("resize", renderer.resize.bind(renderer))
        renderer.resize()

        this.state = { renderer }
    }

    getRenderer(): PixiRenderer {
        return this.state.renderer
    }

    execute(delta: number, time: number) {
        if (!this.state.renderer.isReady()) {
            return
        }

        this.state.renderer.clear()

        this.queries.players.results.forEach(entity => {
            const position = entity.getComponent(Position)!
            this.state.renderer.drawCircle(position.x, position.y, 10, Color.red)
        })

        this.queries.notPlayers.results.forEach(entity => {
            const position = entity.getComponent(Position)!
            this.state.renderer.drawTexture(position.x, position.y, "test.png")
        })

        this.queries.coordinates.results.forEach(entity => {
            const coordinate = entity.getComponent(Coordinate, false)!
            const asPosition = coordinateToXY(coordinate)
            this.state.renderer.drawTexture(300 + asPosition.x, 300 + asPosition.y, "tile.png", TileWidth, TileWidth)
        })

        this.state.renderer.render()
    }
}