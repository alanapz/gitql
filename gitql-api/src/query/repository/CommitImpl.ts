import { GitCommit } from "src/git/entities";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";
import { TreeImpl } from "src/query/repository/TreeImpl";
import { LazyValue } from "src/utils/LazyValue";

const check = require.main.require("./check");

export class CommitImpl {

    private readonly details: LazyValue<GitCommit> = new LazyValue<GitCommit>();

    public constructor(public readonly repository: RepositoryImpl, public readonly id: string) {
        check.nonNull(repository, 'repository');
        check.nonNullNotEmpty(id, 'id');
    }

    fetchParents(resolver: ((self: CommitImpl) => Promise<GitCommit>)): Promise<CommitImpl[]> {
        return this.fetchDetails(resolver).then(details => details.parentIds.map(parentId => new CommitImpl(this.repository, parentId)));
    }

    fetchTree(resolver: ((self: CommitImpl) => Promise<GitCommit>)): Promise<TreeImpl> {
        return this.fetchDetails(resolver).then(details => new TreeImpl(this.repository, details.treeId));
    }

    fetchAuthor(resolver: ((self: CommitImpl) => Promise<GitCommit>)): Promise<string> {
        return this.fetchDetails(resolver).then(details => details.author);
    }

    fetchCommitter(resolver: ((self: CommitImpl) => Promise<GitCommit>)): Promise<string> {
        return this.fetchDetails(resolver).then(details => details.committer);
    }

    fetchMessage(resolver: ((self: CommitImpl) => Promise<GitCommit>)): Promise<string> {
        return this.fetchDetails(resolver).then(details => details.message);
    }

    private fetchDetails(resolver: ((self: CommitImpl) => Promise<GitCommit>)): Promise<GitCommit> {
        return this.details.fetch(() => resolver(this));
    }
}