import { GitTreeItemType } from "src/git/entities";
import { TreeImpl } from "src/query/repository/TreeImpl";

const check = require.main.require("./check");

export class TreeItemImpl {

    public constructor(public readonly tree: TreeImpl, public readonly type: GitTreeItemType, public readonly id: string, public readonly name: string, public readonly mode: string) {
        check.nonNull(tree, 'tree');
        check.nonNull(type, 'type');
        check.nonNullNotEmpty(id, 'id');
        check.nonNullNotEmpty(name, 'name');
        check.nonNullNotEmpty(mode, 'mode');
    }
}