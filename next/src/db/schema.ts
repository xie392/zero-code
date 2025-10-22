import {
  integer,
  pgTable,
  timestamp,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

// columns.helpers.ts
const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

/**
 * @description  用户表
 */
export const users = pgTable(
  'users',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    account: varchar('account', { length: 256 }).notNull().unique(),
    ...timestamps,
  },
  (table) => [uniqueIndex('email_idx').on(table.account)],
)
