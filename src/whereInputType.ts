import { core, inputObjectType } from 'nexus'
import { getTypeFields } from './util'

export interface WhereInputTypeConfig<TypeName extends string> {
  type: core.NexusObjectTypeDef<TypeName>
  filters: Array<core.NexusInputObjectTypeDef<TypeName>>
}

export function whereInputType<TypeName extends string>(
  config: WhereInputTypeConfig<TypeName>
): core.NexusInputObjectTypeDef<string> {
  return inputObjectType({
    name: `${config.type.name}WhereInput`,
    definition(t) {
      const typeFields = getTypeFields(config.type)

      for (const typeField of Object.entries(typeFields)) {
        const [typeFieldName, typeFieldConfig] = typeField

        const filterType = Object.entries(config.filters)
          .map(([_, type]) => type)
          .find((type) => type.name === `${typeFieldConfig.type.toString()}Filters`)

        if (filterType) {
          t.field(typeFieldName, { type: filterType })
        }
      }
    },
  })
}
