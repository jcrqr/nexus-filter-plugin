import { plugin, core } from 'nexus'
import { buildFilterableMethod } from './filterable'
import * as defaultFilters from './filters'

export interface FilterPluginConfig {
  filters?: Array<core.NexusInputObjectTypeDef<string>>
}

export const filterPlugin = (config: FilterPluginConfig = {}) => {
  const filters = [...(config.filters || []), ...Object.values(defaultFilters)]

  return plugin({
    name: 'FilterPlugin',
    onInstall(b) {
      // Add missing filter types
      for (const filterEntry of Object.entries(filters)) {
        const [_, filter] = filterEntry

        if (!b.hasType(filter.name)) {
          b.addType(filter)
        }
      }

      // Add `.filterable` method to type definitions (aka `t`)
      b.addType(buildFilterableMethod(b, filters))
    },
  })
}
