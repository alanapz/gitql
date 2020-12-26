import { Check } from "src/check";
import { GitCommit, isGitCommitObject } from "src/git/entities";
import { GitCatFileProcess } from "src/git/GitCatFileProcess";
import { GitQLContext } from "src/query/ctx/GitQLContext";

const check: Check = require.main.require("./check");

export class GitQLContextImpl implements GitQLContext
{
    private readonly catFileProcessCache: Map<string, GitCatFileProcess> = new Map<string, GitCatFileProcess>();

    getCatFileProcess(repoPath: string): GitCatFileProcess {
        check.stringNonNullNotEmpty(repoPath, "repoPath");

        if (this.catFileProcessCache.has(repoPath)) {
            return this.catFileProcessCache.get(repoPath);
        }

        const process = new GitCatFileProcess(repoPath);
        this.catFileProcessCache.set(repoPath, process);
        return process;
    }

    commitResolver(repoPath: string, commitId: string): Promise<GitCommit> {
        check.stringNonNullNotEmpty(repoPath, "repoPath");
        check.stringNonNullNotEmpty(commitId, "commitId");

        return this.getCatFileProcess(repoPath).lookup(commitId).then(object => {

            if (!isGitCommitObject(object)) {
                throw new Error(`Unexpected object type for commit: ${commitId}`);
            }

            return object;
        });
    }
}
