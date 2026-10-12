import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

import type * as schema from './schema';

/** Aceita tanto o banco do expo-sqlite (app) quanto o better-sqlite3 (testes). */
export type Db = BaseSQLiteDatabase<'sync', unknown, typeof schema>;
