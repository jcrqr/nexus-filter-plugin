import { extendType, objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  description: 'original descr',
  definition(t) {
    t.id('id')
    t.string('name')
  },
})

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.filterable('users', {
      type: User,
      // @ts-ignore
      resolve(_, args) {
        console.log('Args', args)

        return [{ id: '12345', name: 'John Doe' }]
      },
    })
  },
})
