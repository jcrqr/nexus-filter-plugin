import { extendType, objectType } from 'nexus'

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.id('id')
    t.string('title')
  },
})

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.filterable('posts', {
      type: Post,
      // @ts-ignore
      resolve(_, args) {
        console.log('Args', args)

        return [
          {
            id: '12345',
            title: 'Welcome!',
          },
        ]
      },
    })
  },
})
