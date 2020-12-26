import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { GitQLContextImpl } from "src/query/ctx/GitQLContextImpl";

@Injectable()
export class GitContextInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        const graphQLArgs = GqlExecutionContext.create(context).getArgs();

        if (!graphQLArgs['gitQLContext'])
        {
            graphQLArgs['gitQLContext'] = new GitQLContextImpl();
        }

        return next.handle();
    }
}