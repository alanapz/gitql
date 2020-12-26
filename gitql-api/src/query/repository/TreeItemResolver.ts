import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { GitTreeItemType } from "src/git/entities";
import { TreeItemType } from "src/graphql";
import { BlobImpl } from "src/query/repository/BlobImpl";
import { TreeImpl } from "src/query/repository/TreeImpl";
import { TreeItemImpl } from "src/query/repository/TreeItemImpl";

@Resolver("TreeItem")
export class TreeItemResolver {

    @ResolveField("tree")
    getTreeItemTree(@Parent() treeItem: TreeItemImpl): Promise<TreeImpl> {
        return Promise.resolve(treeItem.tree);
    }

    @ResolveField("type")
    getTreeItemType(@Parent() treeItem: TreeItemImpl): Promise<TreeItemType> {
        return Promise.resolve(TreeItemResolver.treeItemTypeMappings[treeItem.type]);
    }

    @ResolveField("id")
    getTreeItemId(@Parent() treeItem: TreeItemImpl): Promise<string> {
        return Promise.resolve(treeItem.id);
    }

    @ResolveField("name")
    getTreeItemName(@Parent() treeItem: TreeItemImpl): Promise<string> {
        return Promise.resolve(treeItem.name);
    }

    @ResolveField("mode")
    getTreeItemMode(@Parent() treeItem: TreeItemImpl): Promise<number> {
        return Promise.resolve(treeItem.mode);
    }

    @ResolveField("blob")
    getTreeItemValueAsBlob(@Parent() treeItem: TreeItemImpl): Promise<BlobImpl> {
        return (treeItem.type === GitTreeItemType.Blob ? Promise.resolve(treeItem.tree.repository.buildBlob(treeItem.id)) : null);
    }

    @ResolveField("subtree")
    getTreeItemValueAsSubtree(@Parent() treeItem: TreeItemImpl): Promise<TreeImpl> {
        return (treeItem.type === GitTreeItemType.Subtree ? Promise.resolve(treeItem.tree.repository.buildTree(treeItem.id)) : null);
    }

    private static readonly treeItemTypeMappings: Record<GitTreeItemType, TreeItemType> = {
        [GitTreeItemType.Blob]: TreeItemType.BLOB,
        [GitTreeItemType.Subtree]: TreeItemType.SUBTREE
    };
}
