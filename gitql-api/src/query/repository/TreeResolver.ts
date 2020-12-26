import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Check } from "src/check";
import { GitTreeItem, GitTreeItemType } from "src/git/entities";
import { GitService } from "src/git/git.service";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";
import { TreeDescendantImpl } from "src/query/repository/TreeDescendantImpl";
import { TreeImpl } from "src/query/repository/TreeImpl";
import { TreeItemImpl } from "src/query/repository/TreeItemImpl";

const check: Check = require.main.require("./check");

@Resolver("Tree")
export class TreeResolver {

    constructor(private readonly gitService: GitService) {}

    @ResolveField("id")
    getTreeId(@Parent() tree: TreeImpl): Promise<string> {
        return Promise.resolve(tree.id);
    }

    @ResolveField("repository")
    getTreeRepository(@Parent() tree: TreeImpl): Promise<RepositoryImpl> {
        return Promise.resolve(tree.repository);
    }

    @ResolveField("items")
    getTreeItems(@Parent() tree: TreeImpl): Promise<TreeItemImpl[]> {
        return tree.fetchItems(() => this.gitService
            .listTreeItems(tree.repository.path, tree.id)
            .then(results => results.map((result: GitTreeItem) => new TreeItemImpl(tree, result.type, result.id, result.name, result.mode))));
    }

    @ResolveField("item")
    getTreeItem(@Parent() tree: TreeImpl, @Args("name") itemName: string): Promise<TreeItemImpl> {
        check.stringNonNullNotEmpty(itemName, 'itemName');
        // Split name by "/"
        return this.walkTreeItem(tree, itemName.split("/"));
    }

    private async walkTreeItem(tree: TreeImpl, remaining: string[]): Promise<TreeItemImpl> {
        const itemName = remaining.shift();
        const items: TreeItemImpl[] = await this.getTreeItems(tree);
        const found: TreeItemImpl = items.find(item => item.name === itemName);

        if (!found) {
            return Promise.reject(`Not found: ${itemName} in tree: ${tree.id}`);
        }

        // If we are last component, try to return
        if (!remaining.length) {
            return Promise.resolve(found);
        }

        if (found.type !== GitTreeItemType.Subtree) {
            return Promise.reject(`Not a subtree: ${itemName} in tree: ${tree.id}`);
        }

        return this.walkTreeItem(found.tree.repository.buildTree(found.id), remaining);
    }

    @ResolveField("descendants")
    getAllDescendants(@Parent() tree: TreeImpl): Promise<TreeDescendantImpl[]> {
        return this.walkAllTreeDescendants(tree, []);
    }

    private async walkAllTreeDescendants(parent: TreeImpl, path: string[]): Promise<TreeDescendantImpl[]> {

        const results: TreeDescendantImpl[] = [];

        for (const item of await this.getTreeItems(parent)) {

            const itemPath = [... path, item.name ];

            results.push({
                path: itemPath.join("/"),
                item: item
            })

            if (item.type === GitTreeItemType.Subtree) {
                results.push(... await this.walkAllTreeDescendants(
                    item.tree.repository.buildTree(item.id),
                    itemPath) );
            }
        }

        return results;
    }
}
