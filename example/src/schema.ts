import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from './graphql'
import { filterPlugin } from 'nexus-filter-plugin'

export const schema = makeSchema({
  types,
  plugins: [filterPlugin()],
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.ts'),
    schema: join(__dirname, '..', 'schema.graphql'),
  },
})
