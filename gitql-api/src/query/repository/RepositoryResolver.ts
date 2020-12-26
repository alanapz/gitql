import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Stats } from "fs";
import { Check } from "src/check";
import { Repository } from "src/generated/graphql";
import { GitObjectType } from "src/git/entities";
import { GitService } from "src/git/git.service";
import { GitQLContext } from "src/query/ctx/GitQLContext";
import { InjectGitQLContext } from "src/query/ctx/InjectGitQLContext";
import { BlobImpl } from "src/query/repository/BlobImpl";
import { CommitImpl } from "src/query/repository/CommitImpl";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";
import { TreeImpl } from "src/query/repository/TreeImpl";

const fs = require("fs/promises");
const path = require("path");

const check: Check = require.main.require("./check");

@Resolver("Repository")
export class RepositoryResolver {

    constructor(private readonly gitService: GitService) {}

    @Query("repository")
    repository(@Args("path") repoPath: string, @InjectGitQLContext() ctx: GitQLContext): Promise<RepositoryImpl> {
        check.stringNonNullNotEmpty(repoPath, "repoPath");
        check.nonNull(ctx, "ctx");

        return fs.stat(path.join(repoPath, ".git"))
            .then((stats: Stats) => this.buildRepository(repoPath, ctx, stats))
            .catch(() => null);
    }

    private buildRepository(repoPath: string, ctx: GitQLContext, stats: Stats): Promise<RepositoryImpl> {
        if (!stats || !stats.isDirectory()) {
            return null;
        }
        return Promise.resolve(new RepositoryImpl(repoPath, ctx));
    }

    @ResolveField("path")
    getRepositoryPath(@Parent() repository: RepositoryImpl): Promise<string> {
        return Promise.resolve(repository.path);
    }

    @ResolveField("blobs")
    listAllBlobs(@Parent() repository: RepositoryImpl): Promise<BlobImpl[]> {
        return repository.fetchAllBlobs(() => this.gitService
            .listObjects(repository.path)
            .then(results => results
                .filter(result => result.type == GitObjectType.Blob)
                .map(result => repository.buildBlob(result.id).setSize(result.size))));
    }

    @ResolveField("blob")
    getBlobById(@Parent() repository: RepositoryImpl, @Args('id') blobId: string): Promise<BlobImpl> {
        check.stringNonNullNotEmpty(blobId, 'blobId');
        return Promise.resolve(repository.buildBlob(blobId));
    }

    @ResolveField("trees")
    listAllTrees(@Parent() repository: RepositoryImpl): Promise<TreeImpl[]> {
        return repository.fetchAllTrees(() => this.gitService
            .listObjects(repository.path)
            .then(results => results
                .filter(result => result.type == GitObjectType.Tree)
                .map(result => repository.buildTree(result.id))));
    }

    @ResolveField("tree")
    getTreeById(@Parent() repository: RepositoryImpl, @Args('id') treeId: string): Promise<TreeImpl> {
        check.stringNonNullNotEmpty(treeId, 'treeId');
        return Promise.resolve(repository.buildTree(treeId));
    }

    @ResolveField("commits")
    async listAllCommits(@Parent() repository: RepositoryImpl): Promise<CommitImpl[]> {
        return repository.fetchAllCommits(() => this.gitService
            .listObjects(repository.path)
            .then(results => results
                .filter(result => result.type == GitObjectType.Commit)
                .map(result => repository.buildCommit(result.id))));
    }

    @ResolveField("commit")
    getCommitById(@Parent() repository: RepositoryImpl, @Args('id') commitId: string): Promise<CommitImpl> {
        check.stringNonNullNotEmpty(commitId, 'commitId');
        return Promise.resolve(repository.buildCommit(commitId));
    }
}
