import { Check } from "src/check";

interface MapItem<V> { value: V }

const check: Check = require.main.require("./check");

export class LazyMap<K, V> {

    private readonly values: Map<K, MapItem<V>> = new Map<K, MapItem<V>>();

    public fetch(key: K, resolver: () => V): V {
        check.nonNull(key, "key");

        if (this.values.has(key)) {
            return this.values.get(key).value;
        }

        const value: V = resolver();
        this.values.set(key, { value });
        return value;
    }
}
