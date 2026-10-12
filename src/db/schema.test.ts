import { eq } from 'drizzle-orm';

import { pessoas } from './schema';
import { createTestDb } from './test-db';

describe('tabela pessoas', () => {
  test('cadastra uma pessoa desmarcada por padrão', () => {
    const db = createTestDb();

    db.insert(pessoas).values({ numero: 1, nome: 'Fulano' }).run();

    const fulano = db.select().from(pessoas).where(eq(pessoas.numero, 1)).get();
    expect(fulano).toMatchObject({ numero: 1, nome: 'Fulano', pago: false });
  });

  test('não aceita número repetido', () => {
    const db = createTestDb();
    db.insert(pessoas).values({ numero: 7, nome: 'Fulano' }).run();

    expect(() => db.insert(pessoas).values({ numero: 7, nome: 'Siclano' }).run()).toThrow(
      /UNIQUE/,
    );
  });
});
