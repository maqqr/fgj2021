import * as PIXI from 'pixi.js'
import { Color } from './game/color'

abstract class RenderPool<T extends PIXI.DisplayObject> {
    protected drawn: number = 0
    protected pool: T[] = []
    protected stage: PIXI.Container

    constructor(stage: PIXI.Container) {
        this.stage = stage
    }

    public clear(): void {
        this.pool.forEach(this.clearElement.bind(this))
        this.drawn = 0
    }

    public get(): T {
        let elem: T
        if (this.drawn >= this.pool.length) {
            elem = this.createElement()
            this.stage.addChild(elem)
            this.pool.push(elem)
        } else {
            elem = this.pool[this.drawn]
        }
        elem.visible = true
        this.drawn++
        return elem
    }

    protected abstract clearElement(elem: T): void
    protected abstract createElement(): T
}

class SpritePool extends RenderPool<PIXI.Sprite> {
    public clearElement(sprite: PIXI.Sprite): void {
        sprite.visible = false
    }

    public createElement(): PIXI.Sprite {
        return new PIXI.Sprite()
    }
}

class GraphicsPool extends RenderPool<PIXI.Graphics> {
    public clearElement(g: PIXI.Graphics): void {
        g.clear()
        g.visible = false
    }

    public createElement(): PIXI.Graphics {
        return new PIXI.Graphics()
    }
}

export class PixiRenderer {
    private stage: PIXI.Container
    private spriteStage: PIXI.Container
    private graphicsStage: PIXI.Container
    private pixirenderer: PIXI.Renderer

    private readonly width: number
    private readonly height: number

    private spritePool: SpritePool
    private graphicsPool: GraphicsPool
    private texturesLoaded = false

    private assetPathPrefix = "static/assets/"

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }

    public initialize(): void {
        const options = {
            width: this.width,
            height: this.height,
            resolution: window.devicePixelRatio || 1,
            roundPixels: false,
        }

        this.pixirenderer = PIXI.autoDetectRenderer(options)
        this.pixirenderer.view.id = "pixi-canvas"
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
        this.stage = new PIXI.Container()
        this.spriteStage = new PIXI.Container()
        this.graphicsStage = new PIXI.Container()

        this.stage.addChild(this.spriteStage)
        this.stage.addChild(this.graphicsStage)

        this.spritePool = new SpritePool(this.spriteStage)
        this.graphicsPool = new GraphicsPool(this.graphicsStage)

        const app = document.getElementById("app")!
        app.appendChild(this.pixirenderer.view)
        this.pixirenderer.backgroundColor = 0x140c1c
    }

    public getCanvas(): HTMLCanvasElement {
        return this.pixirenderer.view
    }


    public isReady(): boolean {
        return this.texturesLoaded
    }

    private onLoadFinished() {
        this.texturesLoaded = true
    }

    public loadTextures(paths: string[]): void {
        if (this.texturesLoaded) {
            console.error("Attempted to load textures multiple times")
            return
        }
        PIXI.Loader.shared.add(paths.map(x => this.assetPathPrefix + x)).load(this.onLoadFinished.bind(this))
    }

    public resize(): void {
        const ratioW = window.innerWidth / this.width
        const ratioH = window.innerHeight / this.height
        const ratio = Math.max(1.0, Math.min(ratioW, ratioH))
        this.stage.scale.x = this.stage.scale.y = ratio
        this.pixirenderer.resize(this.width * ratio, this.height * ratio)
        this.pixirenderer.render(this.stage)
        this.pixirenderer.plugins.interaction.moveWhenInside = true
    }

    public clear(): void {
        this.spritePool.clear()
        this.graphicsPool.clear()
    }

    public drawTexture(x: number, y: number, texName: string, width: number = 0, height: number = 0,
        tint: number = 0xFFFFFF): void {
        const tex = PIXI.utils.TextureCache[this.assetPathPrefix + texName]

        const sprite = this.spritePool.get()
        sprite.texture = tex
        sprite.x = x
        sprite.y = y
        if (width !== 0) {
            sprite.width = width
        }
        if (height !== 0) {
            sprite.height = height
        }
        sprite.tint = tint
    }

    public drawSubTexture(x: number, y: number, texName: string, rect: {x: number, y: number, w: number, h: number},
                          tint: number = 0xFFFFFF): void {
        const tex = new PIXI.Texture(PIXI.utils.TextureCache[texName],
                                     new PIXI.Rectangle(rect.x, rect.y, rect.w, rect.h))

        const sprite = this.spritePool.get()
        sprite.texture = tex
        sprite.x = x
        sprite.y = y
        sprite.tint = tint
    }

    public drawRect(x: number, y: number, width: number, height: number,
                    border: boolean = false, backgroundColor: number = Color.black, alpha: number = 1): void {
        const rect = this.graphicsPool.get()
        rect.beginFill(backgroundColor, alpha)
        if (border) {
            rect.lineStyle(2, Color.white)
        }
        rect.drawRect(x, y, width, height)
    }

    public drawCircle(x: number, y: number, radius: number, color: number, alpha: number = 1): void {
        const rect = this.graphicsPool.get()
        rect.beginFill(color, alpha)
        rect.drawCircle(x, y, radius)
    }

    public render(): void {
        this.pixirenderer.render(this.stage)
    }

    public getMouseUiPosition() : { x: number, y: number } {
        const rect = this.getViewportRect()
        const mouse = this.pixirenderer.plugins.interaction.mouse.global
        return { x: mouse.x + rect.left, y: mouse.y + rect.top }
    }

    /** Returns absolute position and size of the game canvas. */
    public getViewportRect() : DOMRect {
        const domRectList = this.pixirenderer.view.getClientRects()
        return domRectList.item(0)!
    }

    public convertToUICoordinates(pointInGame : {x: number, y: number }) : { x: number, y: number } {
        const rect = this.getViewportRect()
        const x = (pointInGame.x / this.width) * rect.width + rect.left
        const y = (pointInGame.y / this.height) * rect.height + rect.top
        return { x, y }
    }

    public convertToGameCoordinates(uiPoint : {x: number, y: number }) : { x: number, y: number } {
        const rect = this.getViewportRect()
        const x = ((uiPoint.x - rect.left) * this.width) / rect.width
        const y = ((uiPoint.y - rect.top) * this.height) / rect.height
        return { x, y }
    }

    public setCameraOffset(offset: {x: number, y: number }) {
        // this.stage.setTransform(offset.x, offset.y, 0, 0, 0, 0, 0, 0, 0)
        // this.stage.containerUpdateTransform()
    }
}
