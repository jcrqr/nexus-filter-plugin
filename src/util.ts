import { GraphQLInputFieldConfigMap, Thunk } from 'graphql'
import { core } from 'nexus'

export const getTypeFields: <TypeName extends string>(
  config: core.NexusObjectTypeDef<TypeName>
) => Thunk<GraphQLInputFieldConfigMap> = (config) => {
  const { schema } = core.makeSchemaInternal({ types: [config] })

  // FIXME:
  // @ts-ignore
  return schema.getType(config.name)?.toConfig().fields || {}
}
