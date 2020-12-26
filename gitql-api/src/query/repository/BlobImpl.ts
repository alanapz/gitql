import { Check } from "src/check";
import { GitBlob, isGitBlobObject } from "src/git/entities";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";
import { LazyValue } from "src/utils/LazyValue";

const check: Check = require.main.require("./check");

export class BlobImpl {

    private readonly size: LazyValue<number> = new LazyValue<number>();
    private readonly value: LazyValue<string> = new LazyValue<string>();
    private readonly details: LazyValue<GitBlob> = new LazyValue<GitBlob>();

    constructor(public readonly repository: RepositoryImpl, public readonly id: string) {
        check.nonNull(repository, 'repository');
        check.stringNonNullNotEmpty(id, 'id');
    }

    fetchSize(): Promise<number> {
        return this.size.fetch(() => this.fetchDetails().then(details => details.size));
    }

    setSize(size: number): BlobImpl {
        this.size.set(size);
        return this;
    }

    fetchValue(): Promise<string> {
        return this.value.fetch(() => this.fetchDetails().then(details => details.value));
    }

    setValue(value: string): BlobImpl {
        this.value.set(value);
        return this;
    }

    private fetchDetails(): Promise<GitBlob> {
        return this.details.fetch(() => this.repository.getCatFileProcess().lookup(this.id).then(object => {
            if (!isGitBlobObject(object)) {
                throw new Error(`Unexpected object type for blob: ${this.id}`);
            }
            return object;
        }));
    }
}