import { GitCatFileProcess } from "src/git/GitCatFileProcess";

export interface GitQLContext {
    getCatFileProcess: (repoPath: string) => GitCatFileProcess;
}
