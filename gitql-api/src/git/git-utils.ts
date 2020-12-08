import { GitCommit, GitObject, GitObjectType, GitTreeItem, GitTreeItemType } from "src/git/entities";

export class GitUtils {

    private static readonly validObjectTypes: GitObjectType[] = [ GitObjectType.Blob, GitObjectType.Tree, GitObjectType.Commit, GitObjectType.Tag ];

    private static readonly validTreeItemTypes: GitTreeItemType[] = [ GitTreeItemType.Blob, GitTreeItemType.Subtree ];

    public static parseListObjects(input: string): GitObject[] {
        if (!input || !input.trim().length) {
            return [];
        }

        const buffer: GitObject[] = [];

        for (const match of input.trim().matchAll(/^([a-f0-9]{40})\s+(blob|tree|commit|tag)\s+(\d+)$/gmi)) {

            if (GitUtils.validObjectTypes.indexOf(match[2] as GitObjectType) === -1) {
                continue;
            }

            buffer.push({
                id: match[1],
                type: (match[2] as GitObjectType),
                size: parseInt(match[3], 10)
            });
        }

        return buffer;
    }

    public static parseTreeItems(input: string): GitTreeItem[] {
        if (!input || !input.trim().length) {
            return [];
        }

        const buffer: GitTreeItem[] = [];

        for (const match of input.trim().matchAll(/^(\d+)\s+(blob|tree)\s+([a-f0-9]{40})\s+(.*)$/gm)) {

            if (GitUtils.validTreeItemTypes.indexOf(match[2] as GitTreeItemType) === -1) {
                continue;
            }

            buffer.push({
                mode: match[1],
                type: (match[2] as GitTreeItemType),
                id: match[3],
                name: match[4]
            });
        }

        return buffer;
    }

    public static parseCommitDetails(commitId: string, input: string): GitCommit {

        if (!input || !input.trim().length) {
            return null;
        }

        const result = /^tree\s(?<treeId>[a-f0-9]+)\n(parent (?<parentId>[a-f0-9]+)\n)*author\s(?<author>.+?)\ncommitter\s(?<committer>.+?)\n+(?<message>.*)$/gmis.exec(input.trim());

        if (!result) {
            throw new Error(`Unparseable commit ${commitId}: ${input}`);
        }

        return {
            id: commitId,
            parentIds: (result.groups['parentId'] && [ result.groups['parentId'] ] || []),
            treeId: result.groups['treeId'],
            author: result.groups['author'],
            committer: result.groups['committer'],
            message: result.groups['message']
        }
    }
}
