import { Check } from "src/check";
import { GitCommit, isGitCommitObject } from "src/git/entities";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";
import { TreeImpl } from "src/query/repository/TreeImpl";
import { LazyValue } from "src/utils/LazyValue";

const check: Check = require.main.require("./check");

export class CommitImpl {

    private readonly size: LazyValue<number> = new LazyValue<number>();
    private readonly details: LazyValue<GitCommit> = new LazyValue<GitCommit>();

    constructor(public readonly repository: RepositoryImpl, public readonly id: string) {
        check.nonNull(repository, "repository");
        check.stringNonNullNotEmpty(id, "id");
    }

    fetchSize(): Promise<number> {
        return this.size.fetch(() => this.fetchDetails().then(details => details.size));
    }

    setSize(size: number): CommitImpl {
        this.size.set(size);
        return this;
    }

    fetchParents(): Promise<CommitImpl[]> {
        return this.fetchDetails().then(details => details.parentIds.map(parentId => this.repository.buildCommit(parentId)));
    }

    fetchTree(): Promise<TreeImpl> {
        return this.fetchDetails().then(details => this.repository.buildTree(details.treeId));
    }

    fetchAuthor(): Promise<string> {
        return this.fetchDetails().then(details => details.author);
    }

    fetchCommitter(): Promise<string> {
        return this.fetchDetails().then(details => details.committer);
    }

    fetchMessage(): Promise<string> {
        return this.fetchDetails().then(details => details.message);
    }

    private fetchDetails(): Promise<GitCommit> {
        return this.details.fetch(() => this.repository.getCatFileProcess().lookup(this.id).then(object => {
            if (!isGitCommitObject(object)) {
                throw new Error(`Unexpected object type for commit: ${this.id}`);
            }
            return object;
        }));
    }
}