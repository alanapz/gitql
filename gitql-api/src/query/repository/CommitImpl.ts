import { RepositoryImpl } from "src/query/repository/RepositoryImpl";
import { TreeImpl } from "src/query/repository/TreeImpl";
import { LazyValue } from "src/utils/LazyValue";

const check = require.main.require("./check");

export class CommitImpl {

    private readonly tree: LazyValue<TreeImpl> = new LazyValue<TreeImpl>();

    public constructor(public readonly repository: RepositoryImpl, public readonly id: string) {
        check.nonNull(repository, 'repository');
        check.nonNullNotEmpty(id, 'id');
    }

    public fetchTree(resolver: () => Promise<TreeImpl>): Promise<TreeImpl> {
        return this.tree.fetch(resolver);
    }
}