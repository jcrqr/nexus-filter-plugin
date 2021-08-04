import { arg, core, dynamicOutputMethod, PluginBuilderLens } from 'nexus'
import { whereInputType } from './whereInputType'

export function buildFilterableMethod(b: PluginBuilderLens, filters: Array<core.NexusInputObjectTypeDef<string>>) {
  return dynamicOutputMethod({
    name: 'filterable',
    factory({ typeDef: t, args: [fieldName, fieldConfig], stage }) {
      // Skip if it's not on the `build` stage
      if (stage !== 'build') {
        return t.field(fieldName, fieldConfig)
      }

      // Error when the `type` passed in the field's config is a `string`
      // TODO: check how to get existing types in Nexus by their name
      if (!core.isNexusObjectTypeDef(fieldConfig.type)) {
        throw new Error(
          `Filterable requires the field type to be a \`NexusObjectTypeDef\` but was \`${typeof fieldConfig.type}\``
        )
      }

      // Add the `*WhereInput` for this field's type, if it doesn't exist
      const whereInput = whereInputType({ type: fieldConfig.type, filters })

      if (!b.hasType(whereInput.name)) {
        b.addType(whereInput)
      }

      // Return the field with the new arguments
      return t.field(fieldName, {
        ...fieldConfig,
        args: {
          ...fieldConfig.args,
          where: arg({ type: whereInput.name }),
        },
      })
    },
  })
}
