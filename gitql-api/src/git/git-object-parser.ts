import { Check } from "src/check";
import { GitCommit, GitObject, GitObjectDetails, GitObjectType } from "src/git/entities";
import { as } from "src/utils/utils";

const check: Check = require.main.require("./check");

export class GitObjectParserProcessor
{
    private current: GitObjectParser;

    constructor(private results: GitObjectDetails[]) {

    }

    nextLine(line: string): void {

        const matcher = line.match(/^(?<id>[a-f0-9]{40})\s+(?<type>blob|tree|commit|tag)\s+(?<size>\d+)$/i);

        // If we are not a header line, add current line to existing object
        if (!matcher) {
            this.current?.nextLine(line);
            return;
        }

        // If we are a header line, clear previous object (object is now complete)
        this.complete();

        const id = check.stringNonNullNotEmpty(matcher.groups['id'], 'id');
        const type = check.nonNull(matcher.groups['type'] as GitObjectType, 'type');
        const size = check.nonNullNotZero(parseInt(matcher.groups['size'], 10), 'size');

        if (type == GitObjectType.Commit) {
            this.current = new GitCommitParser(id, size)
            return;
        }
    }

    complete() {
        if (this.current) {
            this.results.push(this.current.build());
            this.current = null;
        }
    }
}

export interface GitObjectParser {
    nextLine: (line: string) => void;
    build: () => GitObject;
}

export class GitCommitParser implements GitObjectParser {

    private treeId: string;
    private parentIds: string[] = [];
    private author: string;
    private committer: string;
    private readonly message: string[] = [];

    private headerComplete = false;

    constructor(private readonly id: string, private readonly size: number) {

    }

    nextLine(line: string) {

        if (this.headerComplete) {
            this.message.push(line)
            return;
        }

        if (!line.trim().length) {
            this.headerComplete = true;
            return;
        }

        let matcher: RegExpMatchArray;

        if ((matcher = line.match(/^tree\s+(?<treeId>[a-f0-9]+)\s*$/i))) {
            this.treeId = matcher.groups['treeId'];
        }
        else if ((matcher = line.match(/^parent\s+(?<parentId>[a-f0-9]+)\s*$/i))) {
            this.parentIds.push(matcher.groups['parentId']);
        }
        else if ((matcher = line.match(/^author\s+(?<author>.+?)\s*$/i))) {
            this.author = matcher.groups['author'];
        }
        else if ((matcher = line.match(/^committer\s+(?<committer>.+?)\s*$/i))) {
            this.committer = matcher.groups['committer'];
        }
        else {
            console.warn("Unmatched line: ", line);
        }
    }

    build(): GitCommit {
        return as<GitCommit>({
          type: GitObjectType.Commit,
            id: this.id,
            size: this.size,
            parentIds: this.parentIds,
            treeId: this.treeId,
            author: this.author,
            committer: this.committer,
            message: this.message.join("\n").trim()
        });
    }
}


