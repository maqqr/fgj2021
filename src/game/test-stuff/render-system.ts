import { PixiRenderer } from '../../pixirenderer'
import { PersistentSystem } from '../../persistent-system'
import { Color } from '../color'
import { Position } from '../components'
import { registerWithPriority } from '../../register-system'
import { Not } from 'ecsy'
import { Game } from '../constants'
import { Coordinate } from '../coordinate-system/coordinate'
import { coordinateToXY, TileWidth } from '../coordinate-system/omnipotent-coordinates'
import { Tile, TileType } from '../tiles/tile'
import { Unit } from '../units/unit'
import { Resource, ResourceType } from '../tiles/resource'

type RenderSystemState = { renderer: PixiRenderer }

@registerWithPriority(100)
export class RenderSystem extends PersistentSystem<RenderSystemState> {
    static queries = {
        coordinates: { components: [Coordinate, Tile] },
        resources: { components: [Coordinate, Resource]},
        units: { components: [Coordinate, Unit] },
    }

    initializeState() {
        const renderer = new PixiRenderer(Game.width, Game.height)
        renderer.initialize()
        renderer.loadTextures(["test.png", "mountain.png", "tile.png", "forest.png", "ore.png", "mushrooms.png", "deer.png", "error.png"])


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
        this.state.renderer.setCameraOffset({x: 300, y: 300})

        this.queries.coordinates.results.forEach(entity => {
            const coordinate = entity.getComponent(Coordinate, false)!
            const asPosition = coordinateToXY(coordinate)
            const tile = entity.getComponent(Tile)!
            let tileSprite
            switch (tile.tileType) {
                case TileType.Forest:
                    tileSprite = "forest.png"
                    break
                case TileType.Snow:
                    tileSprite = "tile.png"
                    break
                case TileType.Mountain:
                    tileSprite = "mountain.png"
                    break
                default:
                    tileSprite = "error.png"
                    break
            }

            this.state.renderer.drawTexture(asPosition.x - TileWidth / 2, asPosition.y - TileWidth / 2,
                tileSprite, TileWidth, TileWidth)
        })

        this.queries.units.results.forEach(entity => {
            const pos = coordinateToXY(entity.getComponent(Coordinate)!)
            this.state.renderer.drawCircle(pos.x, pos.y, 10, Color.red)
        })

        this.queries.resources.results.forEach(entity => {
            const coordinate = entity.getComponent(Coordinate, false)!
            const asPosition = coordinateToXY(coordinate)
            const tile = entity.getComponent(Resource)!
            let tileSprite
            switch (tile.resource) {
                case ResourceType.Deer:
                    tileSprite = "deer.png"
                    break
                case ResourceType.Mushrooms:
                    tileSprite = "mushrooms.png"
                    break
                case ResourceType.Ore:
                    tileSprite = "ore.png"
                    break
                default:
                    tileSprite = "error.png"
                    break
            }

            this.state.renderer.drawTexture(asPosition.x, asPosition.y, tileSprite, TileWidth, TileWidth)
        })

        this.state.renderer.render()
    }
}