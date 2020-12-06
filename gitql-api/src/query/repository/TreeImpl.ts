import { RepositoryImpl } from "src/query/repository/RepositoryImpl";
import { TreeItemImpl } from "src/query/repository/TreeItemImpl";
import { LazyValue } from "src/utils/LazyValue";

const check = require.main.require("./check");

export class TreeImpl {

    private readonly items: LazyValue<TreeItemImpl[]> = new LazyValue<TreeItemImpl[]>();

    public constructor(public readonly repository: RepositoryImpl, public readonly id: string) {
        check.nonNull(repository, 'repository');
        check.nonNullNotEmpty(id, 'id');
    }

    public fetchItems(resolver: () => Promise<TreeItemImpl[]>): Promise<TreeItemImpl[]> {
        return this.items.fetch(resolver);
    }
}