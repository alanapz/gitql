import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Stats } from "fs";
import { Repository } from "src/generated/graphql";
import { GitObjectType } from "src/git/entities";
import { GitService } from "src/git/git.service";
import { BlobImpl } from "src/query/repository/BlobImpl";
import { CommitImpl } from "src/query/repository/CommitImpl";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";
import { TreeImpl } from "src/query/repository/TreeImpl";

const fs = require("fs/promises");
const path = require("path");

const check = require.main.require("./check");

@Resolver("Repository")
export class RepositoryResolver {

    constructor(private readonly gitService: GitService) {}

    @Query("repository")
    repository(@Args("path") repoPath: string): Promise<RepositoryImpl> {
        check.nonNullNotEmpty(repoPath, "repoPath");

        return fs.stat(path.join(repoPath, ".git"))
            .then((stats: Stats) => this.buildRepository(repoPath, stats))
            .catch(() => null);
    }

    private buildRepository(repoPath: string, stats: Stats): Promise<RepositoryImpl> {
        if (!stats || !stats.isDirectory()) {
            return null;
        }
        return Promise.resolve(new RepositoryImpl(repoPath));
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
                .map(result => new BlobImpl(repository, result.id).setSize(result.size))));
    }

    @ResolveField("blob")
    getBlobById(@Parent() repository: RepositoryImpl, @Args('id') blobId: string): Promise<BlobImpl> {
        check.nonNullNotEmpty(blobId, 'blobId');
        return Promise.resolve(new BlobImpl(repository, blobId));
    }

    @ResolveField("trees")
    listAllTrees(@Parent() repository: RepositoryImpl): Promise<TreeImpl[]> {
        return repository.fetchAllTrees(() => this.gitService
            .listObjects(repository.path)
            .then(results => results
                .filter(result => result.type == GitObjectType.Tree)
                .map(result => new TreeImpl(repository, result.id))));
    }

    @ResolveField("tree")
    getTreeById(@Parent() repository: RepositoryImpl, @Args('id') treeId: string): Promise<TreeImpl> {
        check.nonNullNotEmpty(treeId, 'treeId');
        return Promise.resolve(new TreeImpl(repository, treeId));
    }

    @ResolveField("commits")
    listAllCommits(@Parent() repository: RepositoryImpl): Promise<CommitImpl[]> {
        return repository.fetchAllCommits(() => this.gitService
            .listObjects(repository.path)
            .then(results => results
                .filter(result => result.type == GitObjectType.Commit)
                .map(result => new CommitImpl(repository, result.id))));
    }

    @ResolveField("commit")
    getCommitById(@Parent() repository: RepositoryImpl, @Args('id') commitId: string): Promise<CommitImpl> {
        check.nonNullNotEmpty(commitId, 'commitId');
        return Promise.resolve(new CommitImpl(repository, commitId));
    }
}
