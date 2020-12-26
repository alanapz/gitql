import { Check } from "src/check";
import { GitObjectDetails } from "src/git/entities";
import { GitUtils } from "src/git/git-utils";

const check: Check = require.main.require("./check");

export class GitCatFileParser
{
    private bytesRemaining: number = 0;

    private buffer: string = "";

    constructor(private readonly objectFound: (object: GitObjectDetails) => void, private readonly objectMissing: (objectId: string) => void) {
        check.nonNull(objectFound, "objectFound");
        check.nonNull(objectMissing, "objectMissing");
    }

    processNext(next: string): void {

        console.log(next);

        for (let i = 0; i< next.length; i++) {

            if (this.bytesRemaining < 0) {
                throw check.error(new Error("Negative bytes remaining"));
            }

            // We are either in "header" or data mode depending on how many bytes remaining
            if (this.bytesRemaining == 0) {
                this.consumeHeader(next.charAt(i));
            } else {
                this.consumeData(next.charAt(i));
            }
        }
    }

    private consumeHeader(next: string): void {

        // Special case \n
        if (next !== "\n") {
            this.buffer += next;
            return;
        }

        console.log("header", this.buffer, "<END>");

        if (!this.buffer.trim().length) {
            return;
        }

        const errMatcher = this.buffer.match(/^(?<id>[a-f0-9]+)\s+missing$/i);

        if (errMatcher) {
            this.objectMissing(errMatcher.groups['id']);
            this.buffer = "";
            return;
        }

        if (this.buffer === "0") {
            // WTF
            return;
        }

        const headerMatcher = this.buffer.match(/^(?<id>[a-f0-9]+)\s+(?<type>blob|tree|commit|tag)\s+(?<size>\d+)$/i);

        if (!headerMatcher) {
            throw check.error(new Error(`Unexpected value: [${this.buffer}] x${next}x `));
        }

//        this.buffer = "";
        this.bytesRemaining = parseInt(headerMatcher.groups['size'], 10);

        //this.consumeData("\n");
    }

    private consumeData(next: string): void {

        this.buffer += next;
        this.bytesRemaining--;

        if (this.bytesRemaining == 0) {
            for (const objectFound of GitUtils.parseObjectDetailsList(this.buffer.trim())) {
                this.objectFound(objectFound);
            }
            this.buffer = "";
        }
    }
}
