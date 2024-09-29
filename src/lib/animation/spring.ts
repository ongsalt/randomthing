import type { Animatable } from "$lib/animation/interface";
import { writable, type Readable, type Writable } from "svelte/store";

/**
 * decay(t) = e^-ct
 * spring(t) = cos(at + b)
 * position(t) = decay(t) * spring(t)
 * Where:
 *  t: time
 *  a: amplitude
 *  b: phase shift
 *  c: decay constant
 * Condition:
 *  position(0) = 0
 *  velocity(0) = initial velocity
 * Parameter:
 *  bounciness - less c
 *  initial velocity - 
 *  reponse time - make every thing 
 * 
 * Fuck all of these im gonna use google implementation(in androidx.animation.animation-core SpringSimulation.kt)
 *
 * Bruhhhhhh svelte/motion already implement this
 */

export class Spring implements Animatable {
    private naturalFreq: number
    private target: number
    private valueWritable: Writable<number>
    private velocity: number = 0
    private isAnimating = false
    constructor(
        private value: number,
        private stiffness: number = 400,
        private dampingRatio: number = 1
    ) {
        this.naturalFreq = Math.sqrt(stiffness)
        this.target = value
        this.valueWritable = writable(value)
    }

    getReadable(): Readable<number> {
        return this.valueWritable
    }

    getValue(): number {
        return this.value;
    }

    snapTo(target: number): void {
        this.value = target
        this.valueWritable.set(target)
        this.velocity = 0
    }

    animateTo(target: number, initialVelocity: number | null = null): void {
        this.target = target
        if (initialVelocity !== null) {
            this.velocity = initialVelocity
        }

        let lastRunTimestamp = performance.now()
        const onFrame = () => {
            const now = performance.now()
            const dt = now - lastRunTimestamp
            lastRunTimestamp = now

            this.update(dt)
            if (this.shouldStopAnimation()) {
                this.snapTo(this.target)
                this.isAnimating = false
            } else {
                requestAnimationFrame(onFrame)
            }
        }

        if (!this.isAnimating) {
            onFrame()
            this.isAnimating = true
        }
    }

    getTarget(): number {
        return this.target
    }

    // Literal copy of https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/animation/animation-core/src/commonMain/kotlin/androidx/compose/animation/core/SpringSimulation.kt;l=1;drc=e2c11e9a69bb27854ba4355c6a5a97148a46eb4f
    // TODO: derived this mathematically myself
    private update(dt: number) {
        const adjustedDisplacement = this.value - this.target
        const deltaT = dt / 1000.0 // unit: seconds
        const dampingRatioSquared = this.dampingRatio * this.dampingRatio
        const r = -this.dampingRatio * this.naturalFreq

        let displacement = 0
        let currentVelocity = 0

        if (this.dampingRatio > 1) {
            // Over damping
            const s = this.naturalFreq * Math.sqrt(dampingRatioSquared - 1)
            const gammaPlus = r + s
            const gammaMinus = r - s

            // Overdamped
            const coeffB =
                (gammaMinus * adjustedDisplacement - this.velocity) / (gammaMinus - gammaPlus)
            const coeffA = adjustedDisplacement - coeffB
            displacement = (coeffA * Math.exp(gammaMinus * deltaT) + coeffB * Math.exp(gammaPlus * deltaT))
            currentVelocity =
                (coeffA * gammaMinus * Math.exp(gammaMinus * deltaT) +
                    coeffB * gammaPlus * Math.exp(gammaPlus * deltaT))
        } else if (this.dampingRatio === 1) {
            // Critically damped
            const coeffA = adjustedDisplacement
            const coeffB = this.velocity + this.naturalFreq * adjustedDisplacement
            const nFdT = -this.naturalFreq * deltaT
            displacement = (coeffA + coeffB * deltaT) * Math.exp(nFdT)
            currentVelocity =
                (((coeffA + coeffB * deltaT) * Math.exp(nFdT) * (-this.naturalFreq)) + coeffB * Math.exp(nFdT))
        } else {
            const dampedFreq = this.naturalFreq * Math.sqrt(1 - dampingRatioSquared)
            // Underdamped
            const cosCoeff = adjustedDisplacement
            const sinCoeff = ((1 / dampedFreq) * (((-r * adjustedDisplacement) + this.velocity)))
            const dFdT = dampedFreq * deltaT
            displacement = (Math.exp(r * deltaT) * ((cosCoeff * Math.cos(dFdT) + sinCoeff * Math.sin(dFdT))))
            currentVelocity =
                (displacement * r +
                    (Math.exp(r * deltaT) *
                        ((-dampedFreq * cosCoeff * Math.sin(dFdT) + dampedFreq * sinCoeff * Math.cos(dFdT)))))
        }

        this.value = displacement + this.target
        this.velocity = currentVelocity
        this.valueWritable.set(this.value)
    }

    private shouldStopAnimation(): boolean {
        return Math.abs(this.value - this.target) <= .1 && Math.abs(this.velocity) <= .1
    }
}