import { Module } from '@nestjs/common';
import { GraphQLModule } from "@nestjs/graphql";
import { GqlModuleOptions } from "@nestjs/graphql/dist/interfaces/gql-module-options.interface";
import { GitModule } from "src/git/git.module";
import { QueryModule } from "src/query/query.module";
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
};

@Module({
  imports: [GraphQLModule.forRoot(graphQl), GitModule, QueryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
