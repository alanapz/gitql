import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

console.log(`cwd: ${process.cwd()}`);

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
    typePaths: [ join(process.cwd(), 'schema/schema.graphqls') ],
    path: join(process.cwd(), 'src/generated/graphql.ts'),
    outputAs: 'interface',
    emitTypenameField: true
});