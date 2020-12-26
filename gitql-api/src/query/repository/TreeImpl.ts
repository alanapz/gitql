import { Check } from "src/check";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";
import { TreeItemImpl } from "src/query/repository/TreeItemImpl";
import { LazyValue } from "src/utils/LazyValue";

const check: Check = require.main.require("./check");

export class TreeImpl {

    private readonly items: LazyValue<TreeItemImpl[]> = new LazyValue<TreeItemImpl[]>();

    public constructor(public readonly repository: RepositoryImpl, public readonly id: string) {
        check.nonNull(repository, 'repository');
        check.stringNonNullNotEmpty(id, 'id');
    }

    public fetchItems(resolver: () => Promise<TreeItemImpl[]>): Promise<TreeItemImpl[]> {
        return this.items.fetch(resolver);
    }
}