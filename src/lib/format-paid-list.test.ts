import type { User } from '@/db/schema';

import { formatPaidList } from './format-paid-list';

const user = (number: number, name: string, paid: boolean): User => ({
  id: number,
  number,
  name,
  paid,
});

describe('formatPaidList', () => {
  test('lista só quem pagou, ordenado pelo número', () => {
    const text = formatPaidList([
      user(3, 'beltrano', true),
      user(2, 'siclano', false),
      user(1, 'fulano', true),
    ]);

    expect(text).toBe('1 - fulano PG\n3 - beltrano PG');
  });

  test('ninguém pagou gera texto vazio', () => {
    expect(formatPaidList([user(1, 'fulano', false)])).toBe('');
    expect(formatPaidList([])).toBe('');
  });
});
