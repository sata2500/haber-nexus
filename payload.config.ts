import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users.js'
import { Articles } from './collections/Articles.js'
import { Categories } from './collections/Categories.js'
import { Tags } from './collections/Tags.js'
import { Media } from './collections/Media.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- HaberNexus',
    },
  },
  collections: [
    Users,
    Articles,
    Categories,
    Tags,
    Media,
  ],
  editor: lexicalEditor({}),
  secret: process.env.AUTH_SECRET || 'your-secret-key-here',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
})
