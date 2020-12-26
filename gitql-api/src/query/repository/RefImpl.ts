import { Check } from "src/check";
import { RefType } from "src/generated/graphql";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";

const check: Check = require.main.require("./check");

export class RefImpl {

    public constructor(public readonly repository: RepositoryImpl, public readonly name: string, public readonly refType: RefType, public readonly targetId: string) {
        check.nonNull(repository, 'repository');
        check.stringNonNullNotEmpty(name, 'name');
    }

    public isType(... types: RefType[]): boolean {
        return types.indexOf(this.refType) !== -1;
    }
}