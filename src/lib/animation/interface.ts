import type { Readable } from "svelte/store"

// android thing
export interface Animatable {
    getReadable(): Readable<number>
    getValue(): number
    snapTo(target: number): void
    animateTo(target: number, initialVelocity: number | null): void
}