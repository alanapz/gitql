import { GitObject, GitObjectDetails, GitObjectType, GitTreeItem, GitTreeItemType } from "src/git/entities";
import { GitObjectParserProcessor } from "src/git/git-object-parser";

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

    /**
     *  Parses git cat-object syntax, where multiple objects are concatenated together
     */
    public static parseObjectDetailsList(rawInput: string): GitObjectDetails[] {

        if (!rawInput || !rawInput.length) {
            return [];
        }

        const input: string[]  = rawInput.trim().split("\n")

        if (!input.length) {
            return [];
        }

        const results: GitObjectDetails[] = [];

        const processor = new GitObjectParserProcessor(results);

        while (input.length) {
            processor.nextLine(input.shift());
        }

        processor.complete();

        return results;
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
                mode: parseInt(match[1], 10),
                type: (match[2] as GitTreeItemType),
                id: match[3],
                name: match[4]
            });
        }

        return buffer;
    }
}
