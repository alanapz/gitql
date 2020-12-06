import { GitCommit, GitObject, GitObjectType, GitTreeItem, GitTreeItemType } from "src/git/entities";

export class GitUtils {

    private static readonly listObjectsPattern = /^([a-f0-9]{40})\s+(blob|tree|commit|tag)\s+(\d+)$/gm;

    private static readonly validObjectTypes: GitObjectType[] = [ GitObjectType.Blob, GitObjectType.Tree, GitObjectType.Commit, GitObjectType.Tag ];

    // 040000 tree 98d9d633a09b12ab2beeeb71fc193390ad0666e9    .idea
    private static readonly listTreeItemsPattern = /^(\d+)\s+(blob|tree)\s+([a-f0-9]{40})\s+(.*)$/gm;

    private static readonly validTreeItemTypes: GitTreeItemType[] = [ GitTreeItemType.Blob, GitTreeItemType.Subtree ];

    // TOOD private static readonly commitDetailsPattern = /^([a-f0-9]{40})\s+(blob|tree|commit|tag)\s+(\d+)$/gm;

    public static parseListObjects(input: string): GitObject[] {
        if (!input || !input.trim().length) {
            return [];
        }

        const buffer: GitObject[] = [];

        for (const match of input.trim().matchAll(GitUtils.listObjectsPattern)) {

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

        for (const match of input.trim().matchAll(GitUtils.listTreeItemsPattern)) {

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

    public static parseCommitDetails(input: string): GitCommit {
        if (!input || !input.trim().length) {
            return null;
        }
        return null;
    }
}
