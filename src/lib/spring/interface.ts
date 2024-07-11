import type { Vec2d } from "$lib/spring/utils";

export interface DynamicAnimation {
    getPosition(time: number): Vec2d
    getResponseDuration(): number
    getSettledDuration(): number

}