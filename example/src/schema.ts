import { makeSchema } from 'nexus'
import { filterPlugin } from 'nexus-filter-plugin'
import { join } from 'path'
import * as types from './graphql'

export const schema = makeSchema({
  types,
  plugins: [filterPlugin({ types })],
  outputs: {
    typegen: join(__dirname, 'nexus-typegen.ts'),
    schema: join(__dirname, '..', 'schema.graphql'),
  },
})
