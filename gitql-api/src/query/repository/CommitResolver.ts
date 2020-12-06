import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { GitService } from "src/git/git.service";
import { CommitImpl } from "src/query/repository/CommitImpl";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";

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
}
