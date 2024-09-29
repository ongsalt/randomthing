import type { Readable } from "svelte/store"

// android thing
export interface Animatable {
    getReadable(): Readable<number>
    getValue(): number
    snapTo(target: number): void
    animateTo(target: number, initialVelocity: number | null): void
}

// feel very weird but ok
export interface Rect {
    x: number,
    y: number,
    width: number,
    height: number
}