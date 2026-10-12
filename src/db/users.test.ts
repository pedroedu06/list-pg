import { createTestDb } from './test-db';
import { createUser, deleteUser, listUsers, updateUser, UserValidationError } from './users';

describe('users', () => {
  test('lista ordenado pelo número', () => {
    const db = createTestDb();
    createUser(db, { number: 3, name: 'Beltrano' });
    createUser(db, { number: 1, name: 'Fulano' });
    createUser(db, { number: 2, name: 'Siclano' });

    expect(listUsers(db).map((u) => u.number)).toEqual([1, 2, 3]);
  });

  test('cria com o nome sem espaços nas pontas e paid=false', () => {
    const db = createTestDb();

    const user = createUser(db, { number: 1, name: '  Fulano  ' });

    expect(user).toMatchObject({ number: 1, name: 'Fulano', paid: false });
    expect(listUsers(db)).toEqual([user]);
  });

  test.each([
    [{ number: 1, name: '' }, 'Informe o nome'],
    [{ number: 1, name: '   ' }, 'Informe o nome'],
    [{ number: 0, name: 'Fulano' }, 'Número inválido'],
    [{ number: -2, name: 'Fulano' }, 'Número inválido'],
    [{ number: 1.5, name: 'Fulano' }, 'Número inválido'],
    [{ number: Number.NaN, name: 'Fulano' }, 'Número inválido'],
  ])('rejeita %o', (input, message) => {
    const db = createTestDb();

    expect(() => createUser(db, input)).toThrow(new UserValidationError(message));
    expect(listUsers(db)).toEqual([]);
  });

  test('rejeita número já cadastrado', () => {
    const db = createTestDb();
    createUser(db, { number: 7, name: 'Fulano' });

    expect(() => createUser(db, { number: 7, name: 'Siclano' })).toThrow(
      new UserValidationError('Número 7 já cadastrado'),
    );
  });

  test('edita número e nome', () => {
    const db = createTestDb();
    const user = createUser(db, { number: 1, name: 'Fulano' });

    updateUser(db, user.id, { number: 5, name: 'Fulano da Silva' });

    expect(listUsers(db)).toEqual([{ ...user, number: 5, name: 'Fulano da Silva' }]);
  });

  test('edita mantendo o próprio número', () => {
    const db = createTestDb();
    const user = createUser(db, { number: 1, name: 'Fulano' });

    updateUser(db, user.id, { number: 1, name: 'Fulano da Silva' });

    expect(listUsers(db)[0].name).toBe('Fulano da Silva');
  });

  test('não edita para o número de outro usuário', () => {
    const db = createTestDb();
    createUser(db, { number: 1, name: 'Fulano' });
    const siclano = createUser(db, { number: 2, name: 'Siclano' });

    expect(() => updateUser(db, siclano.id, { number: 1, name: 'Siclano' })).toThrow(
      new UserValidationError('Número 1 já cadastrado'),
    );
  });

  test('exclui', () => {
    const db = createTestDb();
    const fulano = createUser(db, { number: 1, name: 'Fulano' });
    const siclano = createUser(db, { number: 2, name: 'Siclano' });

    deleteUser(db, fulano.id);

    expect(listUsers(db)).toEqual([siclano]);
  });
});
