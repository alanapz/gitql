import { BlobImpl } from "src/query/repository/BlobImpl";
import { CommitImpl } from "src/query/repository/CommitImpl";
import { TreeImpl } from "src/query/repository/TreeImpl";
import { LazyValue } from "src/utils/LazyValue";

const check = require.main.require("./check");

export class RepositoryImpl {

    private readonly allBlobs: LazyValue<BlobImpl[]> = new LazyValue<BlobImpl[]>();
    private readonly allTrees: LazyValue<TreeImpl[]> = new LazyValue<TreeImpl[]>();
    private readonly allCommits: LazyValue<CommitImpl[]> = new LazyValue<CommitImpl[]>();

    public constructor(public readonly path: string) {
        check.nonNullNotEmpty(path, 'path');
    }

    public fetchAllBlobs(resolver: () => Promise<BlobImpl[]>): Promise<BlobImpl[]> {
        return this.allBlobs.fetch(resolver);
    }

    public fetchAllTrees(resolver: () => Promise<TreeImpl[]>): Promise<TreeImpl[]> {
        return this.allTrees.fetch(resolver);
    }

    public fetchAllCommits(resolver: () => Promise<CommitImpl[]>): Promise<CommitImpl[]> {
        return this.allCommits.fetch(resolver);
    }
}