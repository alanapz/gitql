import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Blob } from "src/generated/graphql";
import { BlobImpl } from "src/query/repository/BlobImpl";
import { RepositoryImpl } from "src/query/repository/RepositoryImpl";

@Resolver("Blob")
export class BlobResolver {

    @ResolveField("id")
    getBlobId(@Parent() blob: BlobImpl): Promise<string> {
        return Promise.resolve(blob.id);
    }

    @ResolveField("repository")
    getBlobRepository(@Parent() blob: BlobImpl): Promise<RepositoryImpl> {
        return Promise.resolve(blob.repository);
    }

    @ResolveField("size")
    getBlobSize(@Parent() blob: BlobImpl): Promise<number> {
        return blob.fetchSize();
    }

    @ResolveField("value")
    getBlobValue(@Parent() blob: BlobImpl): Promise<string> {
        return blob.fetchValue();
    }
}
