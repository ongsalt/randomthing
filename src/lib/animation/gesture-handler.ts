import { vec2d, type Vec2d } from "$lib/animation/utils"

// TODO: think of better name
type StartListener = (position: Vec2d) => unknown
type ReleaseListener = (position: Vec2d, velocity: Vec2d, displacement: Vec2d) => unknown

export class GestureHandler {
    isDragging = false
    x: number = 0
    y: number = 0
    offsetX: number = 0
    offsetY: number = 0
    initialX: number = 0
    initialY: number = 0
    xVelocity: number = 0
    yVelocity: number = 0
    lastPointerEventTimestamp = 0
    private beforeStartListeners: StartListener[] = []
    private onReleaseListeners: ReleaseListener[] = []
    private onDragListeners: ReleaseListener[] = []

    constructor() {
        // I hate js
        this.onPointerDown = this.onPointerDown.bind(this)
        this.onPointerMove = this.onPointerMove.bind(this)
        this.onPointerUp = this.onPointerUp.bind(this)
    }

    onPointerDown(event: PointerEvent) {
        event.preventDefault()
        this.lastPointerEventTimestamp = performance.now()
        this.isDragging = true
        for (const listener of this.beforeStartListeners) {
            listener(vec2d(this.x, this.y))
        }
        this.offsetX = event.clientX - this.x
        this.offsetY = event.clientY - this.y
        this.initialX = this.x
        this.initialY = this.y
        this.xVelocity = 0
        this.yVelocity = 0
    }
    
    onPointerMove(event: PointerEvent) {
        if (this.isDragging === false) {
            return
        }

        event.preventDefault()
        const now = performance.now()
        const dt = (now - this.lastPointerEventTimestamp) / 1000 // in sec
        this.lastPointerEventTimestamp = now

        this.xVelocity = (event.clientX - this.x - this.offsetX) / dt
        this.yVelocity = (event.clientY - this.y - this.offsetY) / dt
        this.x = event.clientX - this.offsetX
        this.y = event.clientY - this.offsetY

        for (const listener of this.onDragListeners) {
            const position = vec2d(this.x, this.y)
            const displacement = position.substract(vec2d(this.initialX, this.initialY))
            listener(position, vec2d(this.xVelocity, this.yVelocity), displacement)
        }
    }
    
    onPointerUp(event: PointerEvent) {
        if (this.isDragging === false) {
            return
        }
        
        event.preventDefault()
        this.isDragging = false

        for (const listener of this.onReleaseListeners) {
            const position = vec2d(this.x, this.y)
            const displacement = position.substract(vec2d(this.initialX, this.initialY))
            listener(position, vec2d(this.xVelocity, this.yVelocity), displacement)
        }
    }

    addBeforeStartListener(listener: StartListener) {
        this.beforeStartListeners.push(listener)
    }

    addOnReleaseListener(listener: ReleaseListener) {
        this.onReleaseListeners.push(listener)
    }

    addOnDragListener(listener: ReleaseListener) {
        this.onDragListeners.push(listener)
    }
}