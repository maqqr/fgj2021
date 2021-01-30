import { PixiRenderer } from '../../pixirenderer'
import { PersistentSystem } from '../../persistent-system'
import { Color } from '../color'
import { Camera, Position } from '../components'
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
import { TurnEntityName } from '../turns/turn-system'
import { Revealed } from '../tiles/revealed'
import { TurnStarted } from '../turns/turn-count'

type RenderSystemState = { renderer: PixiRenderer }

@registerWithPriority(100)
export class RenderSystem extends PersistentSystem<RenderSystemState> {
    static queries = {
        coordinates: { components: [Coordinate, Tile] },
        resources: { components: [Coordinate, Resource] },
        units: { components: [Coordinate, Unit] },
        selection: { components: [Coordinate, Selected] }
    }

    private static magicSize: number = 1.12

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

    moveCamera(direction: { x: number, y: number }, speed: number) {
        const cameraEntity = this.world.entityManager.getEntityByName("camera")
        const camera = cameraEntity?.getMutableComponent(Position)
        if (camera) {
            camera.x += direction.x * speed
            camera.y += direction.y * speed
        } else {
            console.log("Camera not found")
        }
    }

    getCamera(): { x: number, y: number } {
        return this.world.entityManager.getEntityByName("camera")?.getComponent(Position) ?? { x: 0, y: 0 }
    }

    getRenderer(): PixiRenderer {
        return this.state.renderer
    }

    interpolateVector(a: {x: number, y: number}, b: {x: number, y: number}, f: number) {
        // A * f + B * (1.0 - f)
        const x = a.x * f + b.x * (1.0 - f)
        const y = a.y * f + b.y * (1.0 - f)
        return { x, y }
    }

    renderObjects(camera: any) {
        const tileHeight = TileWidth * RenderSystem.magicSize

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

            this.state.renderer.drawTexture(asPosition.x - tileHeight / 2, asPosition.y - tileHeight / 2,
                tileSprite, tileHeight, tileHeight)
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
        const mouseHex = XYToCoordinate(mouse.x - camera.x, mouse.y - camera.y, TileWidth)
        const circlePos = coordinateToXY(mouseHex)

        if (!mouseHex) {
            console.error("mouseHex is undefined")
        }

        //Draw path from origin to the hex under mouse
        const coordSystem = this.world.getSystem(CoordinateSystem)
        const passableCallback = coordSystem.isPassable.bind(coordSystem)
        const path = pathfind(new Coordinate({ x: 0, y: 0, z: 0 }), mouseHex, passableCallback)
        let previous: Coordinate | undefined
        if (path.length > 2){
            for (const pathCoord of path) {
                const screenPos = coordinateToXY(pathCoord)
                this.state.renderer.drawCircle(screenPos.x, screenPos.y, 8, Color.blue)

                if (previous) {
                    for (let f = 0.0; f < 1.0; f += 0.2) {
                        const previousScreenPos = coordinateToXY(previous)
                        const interpolatedPos = this.interpolateVector(screenPos, previousScreenPos, f)
                        this.state.renderer.drawCircle(interpolatedPos.x, interpolatedPos.y, 4, Color.blue)
                    }
                }
                previous = pathCoord
            }
        }
        this.state.renderer.drawCircle(circlePos.x, circlePos.y, 15, Color.blue)
    }

    execute(delta: number, time: number) {
        if (!this.state.renderer.isReady()) {
            return
        }

        const camera = this.getCamera()

        this.state.renderer.clear()
        this.state.renderer.setCameraOffset(camera)

        const turnEntity = this.world.entityManager.getEntityByName(TurnEntityName)
        if (!(turnEntity?.getComponent(TurnStarted))){
            this.renderObjects(camera)
        }

        this.state.renderer.render()
    }
}