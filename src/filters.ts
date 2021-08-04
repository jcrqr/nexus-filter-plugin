import { inputObjectType } from 'nexus'

const filters = [
  { name: 'equals', description: 'Checks if value equals input' },
  { name: 'not', description: 'Checks if value does not equal input' },
  { name: 'in', description: 'Checks if value exists in list of inputs' },
  {
    name: 'notIn',
    description: 'Checks if value does not exist in list of inputs',
  },
  { name: 'lt', description: 'Checks if value is less than input' },
  {
    name: 'lte',
    description: 'Checks if value is less than or equal to input',
  },
  { name: 'gt', description: 'Checks if value is greater than input' },
  { name: 'gte', description: 'Checks if value is greater or equal to input' },
  { name: 'contains', description: 'Checks if value contains the input' },
  { name: 'startsWith', description: 'Checks if value starts with the input' },
  { name: 'endsWith', description: 'Checks if value ends with the input' },
]

export const BooleanFilters = inputObjectType({
  name: 'BooleanFilters',
  definition(t) {
    for (const filter of filters) {
      t.boolean(filter.name, { description: filter.description })
    }
  },
})

export const FloatFilters = inputObjectType({
  name: 'FloatFilters',
  definition(t) {
    for (const filter of filters) {
      t.float(filter.name, { description: filter.description })
    }
  },
})

export const IDFilters = inputObjectType({
  name: 'IDFilters',
  definition(t) {
    for (const filter of filters) {
      t.string(filter.name, { description: filter.description })
    }
  },
})

export const IntFilters = inputObjectType({
  name: 'IntFilters',
  definition(t) {
    for (const filter of filters) {
      t.int(filter.name, { description: filter.description })
    }
  },
})

export const StringFilters = inputObjectType({
  name: 'StringFilters',
  definition(t) {
    for (const filter of filters) {
      t.string(filter.name, { description: filter.description })
    }
  },
})
