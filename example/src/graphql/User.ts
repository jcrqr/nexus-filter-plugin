import { extendType, objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  description: 'A user account',
  definition(t) {
    t.id('id', { description: 'The user unique identifier' })
    t.string('name', { description: 'The user name' })
    t.field('posts', {
      type: 'Post',
      description: 'A list of posts authored by the user',
    })
  },
})

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('users', {
      type: User,
      description: 'List users',
      filterable: true,
      resolve(_, args) {
        console.log('Args', args)

        return [{ id: '12345', name: 'John Doe' }]
      },
    })
  },
})
