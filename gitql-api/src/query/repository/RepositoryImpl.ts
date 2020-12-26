import { Check } from "src/check";
import { RefType } from "src/generated/graphql";
import { GitCatFileProcess } from "src/git/GitCatFileProcess";
import { GitQLContext } from "src/query/ctx/GitQLContext";
import { BlobImpl } from "src/query/repository/BlobImpl";
import { CommitImpl } from "src/query/repository/CommitImpl";
import { RefImpl } from "src/query/repository/RefImpl";
import { TagImpl } from "src/query/repository/TagImpl";
import { TreeImpl } from "src/query/repository/TreeImpl";
import { LazyMap } from "src/utils/LazyMap";
import { LazyValue } from "src/utils/LazyValue";

const check: Check = require.main.require("./check");

export class RepositoryImpl {

    private readonly allBlobs: LazyValue<BlobImpl[]> = new LazyValue<BlobImpl[]>();
    private readonly allTrees: LazyValue<TreeImpl[]> = new LazyValue<TreeImpl[]>();
    private readonly allCommits: LazyValue<CommitImpl[]> = new LazyValue<CommitImpl[]>();

    private readonly cachedBlobs: LazyMap<string, BlobImpl> = new LazyMap<string, BlobImpl>();
    private readonly cachedTrees: LazyMap<string, TreeImpl> = new LazyMap<string, TreeImpl>();
    private readonly cachedCommits: LazyMap<string, CommitImpl> = new LazyMap<string, CommitImpl>();
    private readonly cachedTags: LazyMap<string, TagImpl> = new LazyMap<string, TagImpl>();
    private readonly cachedRefs: LazyMap<string, RefImpl> = new LazyMap<string, RefImpl>();

    constructor(public readonly path: string, private readonly gitQLContext: GitQLContext) {
        check.stringNonNullNotEmpty(path, 'path');
        check.nonNull(gitQLContext, 'gitQLContext');
    }

    fetchAllBlobs(resolver: () => Promise<BlobImpl[]>): Promise<BlobImpl[]> {
        return this.allBlobs.fetch(resolver);
    }

    fetchAllTrees(resolver: () => Promise<TreeImpl[]>): Promise<TreeImpl[]> {
        return this.allTrees.fetch(resolver);
    }

    fetchAllCommits(resolver: () => Promise<CommitImpl[]>): Promise<CommitImpl[]> {
        return this.allCommits.fetch(resolver);
    }

    buildBlob(blobId: string): BlobImpl {
        check.stringNonNullNotEmpty(blobId, "blobId");
        return this.cachedBlobs.fetch(blobId, () => new BlobImpl(this, blobId));
    }

    buildTree(treeId: string): TreeImpl {
        check.stringNonNullNotEmpty(treeId, "treeId");
        return this.cachedTrees.fetch(treeId, () => new TreeImpl(this, treeId));
    }

    buildCommit(commitId: string): CommitImpl {
        check.stringNonNullNotEmpty(commitId, "commitId");
        return this.cachedCommits.fetch(commitId, () => new CommitImpl(this, commitId));
    }

    buildTag(tagName: string): TagImpl {
        check.stringNonNullNotEmpty(tagName, "tagName");
        return this.cachedTags.fetch(tagName, () => new TagImpl(this, tagName));
    }

    buildRef(refName: string, refType: RefType, targetId: string): RefImpl {
        check.stringNonNullNotEmpty(refName, "refName");
        check.stringNonNullNotEmpty(refType, "refType");
        check.stringNonNullNotEmpty(targetId, "targetId");
        return this.cachedRefs.fetch(refName, () => new RefImpl(this, refName, refType, targetId));
    }

    getCatFileProcess(): GitCatFileProcess {
        return this.gitQLContext.getCatFileProcess(this.path);
    }
}