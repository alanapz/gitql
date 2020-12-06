import { RepositoryImpl } from "src/query/repository/RepositoryImpl";
import { LazyValue } from "src/utils/LazyValue";

const check = require.main.require("./check");

export class BlobImpl {

    private readonly size: LazyValue<number> = new LazyValue<number>();
    private readonly value: LazyValue<string> = new LazyValue<string>();

    public constructor(public readonly repository: RepositoryImpl, public readonly id: string) {
        check.nonNull(repository, 'repository');
        check.nonNullNotEmpty(id, 'id');
    }

    public fetchSize(resolver: () => Promise<number>): Promise<number> {
        return this.size.fetch(resolver);
    }

    public setSize(size: number): BlobImpl {
        this.size.set(size);
        return this;
    }

    public fetchValue(resolver: () => Promise<string>): Promise<string> {
        return this.value.fetch(resolver);
    }
}