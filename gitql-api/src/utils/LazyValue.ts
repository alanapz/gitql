export class LazyValue<T> {

    private value: T;
    private fetched: boolean = false;

    public set(value: T): void {
        this.value = value;
        this.fetched = true;
    }

    public fetch(resolver: () => Promise<T>): Promise<T> {
        if (this.fetched) {
            return Promise.resolve(this.value);
        }

        return resolver().then(value => {
            this.value = value;
            this.fetched = true;
            return value;
        });
    }

}
