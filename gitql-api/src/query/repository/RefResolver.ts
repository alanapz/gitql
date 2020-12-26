import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Check } from "src/check";
import { RefType } from "src/generated/graphql";
import { GitService } from "src/git/git.service";
import { CommitImpl } from "src/query/repository/CommitImpl";
import { RefImpl } from "src/query/repository/RefImpl";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";
import { TagImpl } from "src/query/repository/TagImpl";

const check: Check = require.main.require("./check");

@Resolver("Ref")
export class RefResolver {

    constructor(private readonly gitService: GitService) {}

    @ResolveField("name")
    getRefName(@Parent() ref: RefImpl): Promise<string> {
        return Promise.resolve(ref.name);
    }

    @ResolveField("repository")
    getRefRepository(@Parent() ref: RefImpl): Promise<RepositoryImpl> {
        return Promise.resolve(ref.repository);
    }

    @ResolveField("type")
    getRefType(@Parent() ref: RefImpl): Promise<RefType> {
        return Promise.resolve(ref.refType);
    }

    @ResolveField("tree")
    getRefCommit(@Parent() ref: RefImpl): Promise<CommitImpl> {
        return null; // (ref.isType(RefType.BRANCH, RefType.REMOTE_TRACKING_BRANCH) ? Promise.resolve(ref.repository.buildCommit(ref.targetId)) : null);
    }

    @ResolveField("branchName")
    getRefBranchName(@Parent() ref: RefImpl): Promise<string> {
        return null;
    }

    @ResolveField("remoteName")
    getRefRemoteName(@Parent() ref: RefImpl): Promise<string> {
        return null;
    }

    @ResolveField("tag")
    getRefTag(@Parent() ref: RefImpl): Promise<TagImpl> {
        return (ref.isType(RefType.TAG) ? Promise.resolve(ref.repository.buildTag(ref.targetId)) : null);
    }
}
