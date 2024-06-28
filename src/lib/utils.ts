export function repeat(times: number, fn: (index: number) => unknown) {
    for (let i = 0; i < times; i++) {
        fn(i)
    }
}

export function enumerate<T>(array: T[]): [T, number][] {
    return array.map((it, i) => [it, i])
}