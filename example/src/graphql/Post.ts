import { extendType, objectType, scalarType } from 'nexus'

export const Date = scalarType({ name: 'Date' })

export const Post = objectType({
  name: 'Post',
  description: 'A blog post',
  definition(t) {
    t.id('id', { description: 'The post unique identifier' })
    t.string('title', { description: 'The post title' })
    t.field('createdAt', { type: Date, description: 'The post creation date' })
    t.field('author', { type: 'User', description: 'The user who authored the post' })
  },
})

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('posts', {
      type: Post,
      description: 'List posts',
      filterable: true,
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
