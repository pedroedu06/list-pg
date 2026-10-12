import { eq } from 'drizzle-orm';

import { users } from './schema';
import { createTestDb } from './test-db';

describe('tabela users', () => {
  test('cadastra um usuário com paid=false por padrão', () => {
    const db = createTestDb();

    db.insert(users).values({ number: 1, name: 'Fulano' }).run();

    const fulano = db.select().from(users).where(eq(users.number, 1)).get();
    expect(fulano).toMatchObject({ number: 1, name: 'Fulano', paid: false });
  });

  test('não aceita número repetido', () => {
    const db = createTestDb();
    db.insert(users).values({ number: 7, name: 'Fulano' }).run();

    expect(() => db.insert(users).values({ number: 7, name: 'Siclano' }).run()).toThrow(/UNIQUE/);
  });
});
