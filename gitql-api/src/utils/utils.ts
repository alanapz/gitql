import { identity } from "rxjs";
import { MapOperator } from "rxjs/internal/operators/map";

export function as<T>(obj: T): T {
    return obj;
}

export function of<T>(... obj: T[]): T[] {
    return obj;
}

export function aggregate<T>(input: T[][]): T[] {
    const buffer: T[] = [];
    for (const inputItem of input) {
        buffer.push(... inputItem);
    }
    return buffer;
}

export function toMap<T, K, V>(input: T[], keyFn: (input: T) => K, valueFn: (input: T) => V): Map<K, V> {
    const map = new Map<K, V>();
    for (const inputItem of input) {
        map.set(keyFn(inputItem), valueFn(inputItem));
    }
    return map;
}

export function immediatePromise(): Promise<unknown> {

    return new Promise((resolve: ((value: unknown) => void), reject: ((reason?: any) => void)) => {

        setTimeout(() => {
            resolve(true);
        }, 0);

    });
}
