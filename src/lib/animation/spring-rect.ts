import type { Rect } from "$lib/animation/interface";
import { Spring } from "$lib/animation/spring";
import type { Vec2d } from "$lib/animation/utils";
import { derived, type Readable } from "svelte/store";

export class SpringRect {
    x: Spring
    y: Spring
    width: Spring
    height: Spring
    rect: Readable<Rect>

    constructor(
        { x, y, width, height }: Rect,
        stiffness: number = 250,
        dampingRatio = 1
    ) {
        this.x = new Spring(x, stiffness, dampingRatio)
        this.y = new Spring(y, stiffness, dampingRatio)
        this.width = new Spring(width, stiffness, dampingRatio)
        this.height = new Spring(height, stiffness, dampingRatio)
        this.rect = derived(
            [this.x.getReadable(), this.y.getReadable(), this.width.getReadable(), this.height.getReadable()],
            ([x, y, width, height]) => ({ x, y, width, height })
        )
    }

    getReadable(): Readable<Rect> {
        return this.rect
    }

    animateTo(target: Rect, initialVelocity: Vec2d | null = null, scalingFactor = 600) {
        this.x.animateTo(target.x, initialVelocity?.x ?? null)
        this.y.animateTo(target.y, initialVelocity?.y ?? null)
        // should i do the same for height animation
        const dyByDt = initialVelocity?.y ?? null
        const initialScalingSpeed = dyByDt ? -Math.abs(dyByDt / scalingFactor) : null
        this.width.animateTo(target.width, initialScalingSpeed)
        this.height.animateTo(target.height, initialScalingSpeed)
    }

    moveTo({ x, y }: Vec2d) {
        this.x.snapTo(x)
        this.y.snapTo(y)
    }

    // Might explode
    setSize({ width, height }: Vec2d) {
        this.width.snapTo(width)
        this.height.snapTo(height)
    }
}