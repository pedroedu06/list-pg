import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'node:path';

import * as schema from './schema';

/** Banco SQLite em memória com as migrations reais de ./drizzle aplicadas. */
export function createTestDb() {
  const db = drizzle(new Database(':memory:'), { schema });
  migrate(db, { migrationsFolder: path.resolve(__dirname, '../../drizzle') });
  return db;
}
