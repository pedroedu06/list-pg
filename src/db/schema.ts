import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const pessoas = sqliteTable('pessoas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  numero: integer('numero').notNull().unique(),
  nome: text('nome').notNull(),
  pago: integer('pago', { mode: 'boolean' }).notNull().default(false),
});

export type Pessoa = typeof pessoas.$inferSelect;
export type NovaPessoa = typeof pessoas.$inferInsert;
