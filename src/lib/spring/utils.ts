export class Vec2d {
    constructor(public x: number, public y: number) { }

    add(b: Vec2d) {
        return new Vec2d(this.x + b.x, this.y + b.y)
    }

    substract(b: Vec2d) {
        return new Vec2d(this.x - b.x, this.y - b.y)
    }

    multiply(s: number) {
        return new Vec2d(this.x * s, this.y * s)
    }

    clone() {
        return new Vec2d(this.x, this.y)
    }

    static ZERO = new Vec2d(0, 0);
}

export function map(value: number, s1: number, s2: number, t1: number, t2: number) {
    return (value - s1) / (s2 - s1) * (t1 - t2) + t2
}
