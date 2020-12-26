import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { GqlModuleOptions } from "@nestjs/graphql/dist/interfaces/gql-module-options.interface";
import { GitModule } from "src/git/git.module";
import { GitContextInterceptor } from "src/query/ctx/GitContextInterceptor";
import { QueryModule } from "src/query/query.module";
import { AppController } from './app.controller';

const join = require('path').join;

const graphQl: GqlModuleOptions = {
  typePaths: [ join(process.cwd(), 'schema/schema.graphqls') ],
  debug: true,
  playground: true,
  definitions: {
    path: join(process.cwd(), 'src/generated/graphql.ts'),
    outputAs: 'interface',
    emitTypenameField: true
  },
  // https://docs.nestjs.com/graphql/other-features#execute-enhancers-at-the-field-resolver-level
  fieldResolverEnhancers: ['interceptors']
};

@Module({
  imports: [GraphQLModule.forRoot(graphQl), GitModule, QueryModule],
  controllers: [AppController],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: GitContextInterceptor,
  }],
})
export class AppModule {}
