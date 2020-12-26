import { Check } from "src/check";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";

const check: Check = require.main.require("./check");

export class TagImpl {

    public constructor(public readonly repository: RepositoryImpl, public readonly name: string) {
        check.nonNull(repository, 'repository');
        check.stringNonNullNotEmpty(name, 'name');
    }
}