import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { GitCommit } from "src/git/entities";
import { GitService } from "src/git/git.service";
import { CommitImpl } from "src/query/repository/CommitImpl";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";
import { TreeImpl } from "src/query/repository/TreeImpl";

const check = require.main.require("./check");

@Resolver("Commit")
export class CommitResolver {

    constructor(private readonly gitService: GitService) {}

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
        return commit.fetchParents(this.fetchCommitDetails());
    }

    @ResolveField("tree")
    getCommitTree(@Parent() commit: CommitImpl): Promise<TreeImpl> {
        return commit.fetchTree(this.fetchCommitDetails());
    }

    @ResolveField("author")
    getCommitAuthor(@Parent() commit: CommitImpl): Promise<string> {
        return commit.fetchAuthor(this.fetchCommitDetails());
    }

    @ResolveField("committer")
    getCommitCommitter(@Parent() commit: CommitImpl): Promise<string> {
        return commit.fetchCommitter(this.fetchCommitDetails());
    }

    @ResolveField("message")
    getCommitMessage(@Parent() commit: CommitImpl): Promise<string> {
        return commit.fetchMessage(this.fetchCommitDetails());
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

        return commit.fetchParents(this.fetchCommitDetails())
            .then(parents =>  Promise.all(parents.map(parent => this.recurseCommitAncestors(parent, allCommits))));
    }

    private fetchCommitDetails(): ((self: CommitImpl) => Promise<GitCommit>) {
        return (commit: CommitImpl) => this.gitService.getCommitDetails(commit.repository.path, commit.id);
    }
}
