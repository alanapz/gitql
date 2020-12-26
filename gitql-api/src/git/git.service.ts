import { Injectable } from '@nestjs/common';
import { Check } from "src/check";
import { GitObject, GitTreeItem } from "src/git/entities";
import { GitUtils } from "src/git/git-utils";

const check: Check = require.main.require("./check");

@Injectable()
export class GitService {

    public listObjects(repoPath: string): Promise<GitObject[]> {
        check.stringNonNullNotEmpty(repoPath, "repoPath");
        return this.gitExecute(['-C', repoPath, 'cat-file', '--batch-check', '--batch-all-objects']).then(result => GitUtils.parseListObjects(result));
    }

    public listTreeItems(repoPath: string, treeId: string): Promise<GitTreeItem[]> {
        check.stringNonNullNotEmpty(repoPath, "repoPath");
        check.stringNonNullNotEmpty(treeId, "treeId");
        return this.gitExecute(['-C', repoPath, 'cat-file', '-p', treeId]).then(result => GitUtils.parseTreeItems(result));
    }

    private gitExecute(args: string[], input?: string): Promise<string> {

        return new Promise((resolve, reject) => {

            const { spawn } = require('child_process');

            console.log("git", ... args);

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

            if (input) {
                cmd.stdin.setEncoding('utf-8');
                cmd.stdin.write(input);
                cmd.stdin.end();
            }
        });
    }
}
