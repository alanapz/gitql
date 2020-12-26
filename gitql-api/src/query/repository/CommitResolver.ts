import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { CommitImpl } from "src/query/repository/CommitImpl";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";
import { TreeImpl } from "src/query/repository/TreeImpl";
import { immediatePromise } from "src/utils/utils";

@Resolver("Commit")
export class CommitResolver {

    @ResolveField("id")
    getCommitId(@Parent() commit: CommitImpl): Promise<string> {
        return Promise.resolve(commit.id);
    }

    @ResolveField("repository")
    getCommitRepository(@Parent() commit: CommitImpl): Promise<RepositoryImpl> {
        return Promise.resolve(commit.repository);
    }

    @ResolveField("parents")
    getCommitParents(@Parent() commit: CommitImpl): Promise<CommitImpl[]> {
        return commit.fetchParents();
    }

    @ResolveField("tree")
    getCommitTree(@Parent() commit: CommitImpl): Promise<TreeImpl> {
        return commit.fetchTree();
    }

    @ResolveField("author")
    getCommitAuthor(@Parent() commit: CommitImpl): Promise<string> {
        return commit.fetchAuthor();
    }

    @ResolveField("committer")
    getCommitCommitter(@Parent() commit: CommitImpl): Promise<string> {
        return commit.fetchCommitter();
    }

    @ResolveField("message")
    getCommitMessage(@Parent() commit: CommitImpl): Promise<string> {
        return commit.fetchMessage();
    }

    @ResolveField("ancestors")
    getCommitAncestors(@Parent() commit: CommitImpl): Promise<CommitImpl[]> {
        const ancestors = new Map<string, CommitImpl>();
        return this.recurseCommitAncestors(commit, ancestors).then(() => Array.from(ancestors.values()));
    }

    private recurseCommitAncestors(commit: CommitImpl, allCommits: Map<string, CommitImpl>): Promise<unknown> {
        if (allCommits.has(commit.id)) {
            return Promise.resolve();
        }
        allCommits.set(commit.id, commit);

        return immediatePromise().then(() => {
            return commit.fetchParents()
                .then(parents =>  Promise.all(parents.map(parent => this.recurseCommitAncestors(parent, allCommits))));
        })

    }
}
