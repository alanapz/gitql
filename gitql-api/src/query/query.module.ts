import { Module } from "@nestjs/common";
import { GitModule } from "src/git/git.module";
import { BlobResolver } from "src/query/repository/BlobResolver";
import { CommitResolver } from "src/query/repository/CommitResolver";
import { RepositoryResolver } from "src/query/repository/RepositoryResolver";
import { TreeItemResolver } from "src/query/repository/TreeItemResolver";
import { TreeResolver } from "src/query/repository/TreeResolver";

@Module({
  imports: [GitModule],
  providers: [RepositoryResolver, BlobResolver, TreeResolver, TreeItemResolver, CommitResolver],
})
export class QueryModule {}
