import { PixiRenderer } from '../../pixirenderer'
import { PersistentSystem } from '../../persistent-system'
import { Color } from '../color'
import { Position } from '../components'
import { registerWithPriority } from '../../register-system'
import { Not } from 'ecsy'
import { Game } from '../constants'
import { Coordinate } from '../coordinate-system/coordinate'
import { coordinateToXY, TileWidth, XYToCoordinate } from '../coordinate-system/omnipotent-coordinates'
import { Tile, TileType } from '../tiles/tile'
import { Unit } from '../units/unit'
import { Resource, ResourceType } from '../tiles/resource'
import { Selected } from '../input-system/selected'
import { pathfind } from '../pathfinding'
import { CoordinateSystem } from '../coordinate-system/coordinate-system'

type RenderSystemState = { renderer: PixiRenderer }

@registerWithPriority(100)
export class RenderSystem extends PersistentSystem<RenderSystemState> {
    static queries = {
        coordinates: { components: [Coordinate, Tile] },
        resources: { components: [Coordinate, Resource] },
        units: { components: [Coordinate, Unit] },
        selection: { components: [Coordinate, Selected] },
    }

    initializeState() {
        const renderer = new PixiRenderer(Game.width, Game.height)
        renderer.initialize()
        renderer.loadTextures([
            "test.png",
            "mountain.png",
            "tile.png",
            "forest.png",
            "ore.png",
            "mushrooms.png",
            "deer.png",
            "Selection.png",
            "error.png"
        ])


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

        const cameraX = 300
        const cameraY = 300

        this.state.renderer.clear()
        this.state.renderer.setCameraOffset({x: cameraX, y: cameraY})

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

            this.state.renderer.drawTexture(asPosition.x - TileWidth / 2, asPosition.y - TileWidth / 2,
                tileSprite, TileWidth, TileWidth)
        })

        this.queries.selection.results.forEach(entity => {
            const pos = coordinateToXY(entity.getComponent(Coordinate)!)
            this.state.renderer.drawTexture(pos.x - TileWidth / 2, pos.y - TileWidth / 2,
                "Selection.png", TileWidth * 1.1, TileWidth * 1.1)
            this.state.renderer.drawCircle(pos.x, pos.y, 10, Color.red)
        })

        const mouse = this.state.renderer.convertToGameCoordinates(this.state.renderer.getMouseUiPosition())
        const mouseHex = XYToCoordinate(mouse.x - cameraX, mouse.y - cameraY, TileWidth)
        const circlePos = coordinateToXY(mouseHex)

        const passableCallback = this.world.getSystem(CoordinateSystem).isPassable
        for (const pathCoord of pathfind(new Coordinate({ x: 0, y: 0, z: 0 }), mouseHex, passableCallback)) {
            const screenPos = coordinateToXY(pathCoord)
            this.state.renderer.drawCircle(screenPos.x, screenPos.y, 8, Color.blue)
        }
        this.state.renderer.drawCircle(circlePos.x, circlePos.y, 15, Color.blue)

        this.state.renderer.render()
    }
}