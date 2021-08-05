import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql'
import { arg, core as nexusCore, inputObjectType, PluginBuilderLens } from 'nexus'

type GraphQLType = GraphQLScalarType | GraphQLObjectType

type NexusTypeDef<TypeName extends string = string> =
  | nexusCore.NexusScalarTypeDef<TypeName>
  | nexusCore.NexusObjectTypeDef<TypeName>
  | nexusCore.NexusExtendTypeDef<TypeName>

type NexusTypeMap = Record<string, NexusTypeDef<string>>

export interface FilterPluginConfig {
  types: NexusTypeMap
}

const DEFAULT_SCALAR_TYPES: Array<GraphQLScalarType> = [
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
]

const DEFAULT_SCALAR_FILTERS = [
  {
    name: 'equals',
    description: 'Checks if value equals input.',
  },
  {
    name: 'not',
    description: 'Checks if value does not equal input.',
  },
  {
    name: 'in',
    description: 'Checks if value exists in list of inputs.',
  },
  {
    name: 'notIn',
    description: 'Checks if value does not exist in list of inputs.',
  },
  {
    name: 'lt',
    description: 'Checks if value is less than input.',
  },
  {
    name: 'lte',
    description: 'Checks if value is less than or equal to input.',
  },
  {
    name: 'gt',
    description: 'Checks if value is greater than input.',
  },
  {
    name: 'gte',
    description: 'Checks if value is greater or equal to input.',
  },
  {
    name: 'contains',
    description: 'Checks if value contains the input.',
  },
  {
    name: 'startsWith',
    description: 'Checks if value starts with the input.',
  },
  {
    name: 'endsWith',
    description: 'Checks if value ends with the input.',
  },
]

export class FilterPlugin extends nexusCore.NexusPlugin {
  private _types: Array<GraphQLType>
  private _builder?: PluginBuilderLens

  constructor(config: FilterPluginConfig) {
    super({
      name: 'FilterPlugin',
      fieldDefTypes: [
        nexusCore.printedGenTyping({
          optional: true,
          name: 'filterable',
          type: 'boolean',
        }),
      ],
      onInstall: (b) => this.onInstall(b),
      onAddOutputField: (f) => this.onAddOutputField(f),
    })

    this._types = normalizeTypes(config.types)
  }

  get builder(): PluginBuilderLens {
    if (!this._builder) {
      throw new Error("Trying to access PluginBuilderLens before it's defined")
    }

    return this._builder
  }

  onInstall(builder: PluginBuilderLens) {
    this._builder = builder

    const scalarTypesInputs = [
      ...this._types.filter((t) => t instanceof GraphQLScalarType),
      ...DEFAULT_SCALAR_TYPES,
    ].map((type) => whereInputForScalarType(type as GraphQLScalarType, DEFAULT_SCALAR_FILTERS))

    const objectTypesInputs = this._types
      .filter((t) => t instanceof GraphQLObjectType)
      .map((type) => whereInputForObjectType(type as GraphQLObjectType))

    for (const type of [...scalarTypesInputs, ...objectTypesInputs]) {
      this.builder.addType(type)
    }
  }

  onAddOutputField(field: nexusCore.NexusOutputFieldDef): nexusCore.NexusOutputFieldDef {
    if (
      field.parentType !== 'Query' ||
      // @ts-expect-error FIXME:
      !field.filterable
    ) {
      return field
    }

    const typeName =
      typeof field.type === 'object' && 'name' in field.type
        ? field.type.name
        : field.type.toString()

    return {
      ...field,
      args: { ...field.args, where: arg({ type: nameForWhereInput(typeName) }) },
    }
  }
}

export function filterPlugin(config: FilterPluginConfig) {
  return new FilterPlugin(config)
}

function normalizeTypes(types: NexusTypeMap): Array<GraphQLType> {
  const schemaBuilder = new nexusCore.SchemaBuilder({})

  schemaBuilder.addTypes(types)

  const { typeMap } = schemaBuilder.getFinalTypeMap() as unknown as Record<string, GraphQLNamedType>

  return Object.entries(typeMap)
    .filter(
      ([_, type]) => !(type instanceof GraphQLScalarType) || !(type instanceof GraphQLObjectType)
    )
    .filter(([name, _]) => !['Query', 'Mutation'].includes(name))
    .map(([_name, type]) => type as GraphQLType)
}

function whereInputForScalarType(
  type: GraphQLScalarType,
  filters = DEFAULT_SCALAR_FILTERS
): nexusCore.NexusInputObjectTypeDef<string> {
  return inputObjectType({
    name: nameForWhereInput(type.name),
    definition(t) {
      for (const filter of filters) {
        t.field(filter.name, { ...filter, type: type.toString() })
      }
    },
  })
}

function whereInputForObjectType(
  type: GraphQLObjectType
): nexusCore.NexusInputObjectTypeDef<string> {
  return inputObjectType({
    name: nameForWhereInput(type.name),
    definition(t) {
      for (const field of Object.entries(type.getFields())) {
        const [fieldName, fieldConfig] = field

        if (fieldConfig.type instanceof GraphQLObjectType) {
          t.field(fieldName, { type: nameForWhereInput(fieldConfig.type.name) })
          continue
        }

        t.field(fieldName, { type: nameForWhereInput(fieldConfig.type.toString()) })
      }
    },
  })
}

function nameForWhereInput(base: string) {
  return `${base}WhereInput`
}
