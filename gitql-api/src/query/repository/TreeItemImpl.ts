import { Check } from "src/check";
import { GitTreeItemType } from "src/git/entities";
import { TreeImpl } from "src/query/repository/TreeImpl";

const check: Check = require.main.require("./check");

export class TreeItemImpl {

    constructor(public readonly tree: TreeImpl, public readonly type: GitTreeItemType, public readonly id: string, public readonly name: string, public readonly mode: number) {
        check.nonNull(tree, 'tree');
        check.nonNull(type, 'type');
        check.stringNonNullNotEmpty(id, 'id');
        check.stringNonNullNotEmpty(name, 'name');
        check.nonNull(mode, 'mode');
    }
}