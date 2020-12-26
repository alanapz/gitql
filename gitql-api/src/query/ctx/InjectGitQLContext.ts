import { createParamDecorator } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { GitQLContext } from "src/query/ctx/GitQLContext";
import { GitQLContextImpl } from "src/query/ctx/GitQLContextImpl";

export const InjectGitQLContext = createParamDecorator(
    (data: unknown, context: ExecutionContextHost): GitQLContext => {

        const obj: any = context.getArgByIndex(1)['gitQLContext'];

        if (!(obj instanceof GitQLContextImpl)) {
            throw new Error("Couldn't retrieve gitQLContext from request");
        }

        return obj;
    }
);