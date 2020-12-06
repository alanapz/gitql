import { Injectable } from '@nestjs/common';
import { GitCommit, GitObject, GitTreeItem } from "src/git/entities";
import { GitUtils } from "src/git/git-utils";

const check = require.main.require("./check");

@Injectable()
export class GitService {

    public listObjects(repoPath: string): Promise<GitObject[]> {
        check.nonNullNotEmpty(repoPath, "repoPath");
        return this.gitExecute(['-C', repoPath, 'cat-file', '--batch-all-objects', '--batch-check']).then(value => GitUtils.parseListObjects(value));
    }

    public getObjectSize(repoPath: string, objectId: string): Promise<number> {
        check.nonNullNotEmpty(repoPath, "repoPath");
        check.nonNullNotEmpty(objectId, "objectId");
        return this.gitExecute(['-C', repoPath, 'cat-file', '-s', objectId]).then(value => parseInt(value, 10));
    }

    public getObjectValue(repoPath: string, objectId: string): Promise<string> {
        check.nonNullNotEmpty(repoPath, "repoPath");
        check.nonNullNotEmpty(objectId, "objectId");
        return this.gitExecute(['-C', repoPath, 'cat-file', '-p', objectId]);
    }

    public listTreeItems(repoPath: string, treeId: string): Promise<GitTreeItem[]> {
        check.nonNullNotEmpty(repoPath, "repoPath");
        check.nonNullNotEmpty(treeId, "treeId");
        return this.gitExecute(['-C', repoPath, 'cat-file', '-p', treeId]).then(value => GitUtils.parseTreeItems(value));
    }

    public getCommitDetails(repoPath: string, commitId: string): Promise<GitCommit> {
        check.nonNullNotEmpty(repoPath, "repoPath");
        check.nonNullNotEmpty(commitId, "commitId");
        return this.gitExecute(['-C', repoPath, 'cat-file', '-p', commitId]).then(value => GitUtils.parseCommitDetails(value));
    }

    private gitExecute(args: string[]): Promise<string> {

        return new Promise((resolve, reject) => {

            const { spawn } = require('child_process');

            const cmd = spawn('git', args);

            let output: string = "";
            let error: string = "";

            cmd.stdout.on('data', (data) => { output += data.toString(); });
            cmd.stderr.on('data', (data) => { error += data.toString(); });

            cmd.on('close', (code) => {
                if (code !== 0) {
                    reject(code);
                    return;
                }

                if (error.length) {
                    reject(error);
                    return;
                }

                resolve(output.trim());
            });
        });
    }
}
