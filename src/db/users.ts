import { and, asc, eq, ne } from 'drizzle-orm';

import { users, type User } from './schema';
import type { Db } from './types';

export type UserInput = { number: number; name: string };

/** Erro de validação com mensagem pronta para mostrar ao usuário. */
export class UserValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserValidationError';
  }
}

export function listUsers(db: Db): User[] {
  return db.select().from(users).orderBy(asc(users.number)).all();
}

export function createUser(db: Db, input: UserInput): User {
  const values = validate(db, input);
  return db.insert(users).values(values).returning().get();
}

export function updateUser(db: Db, id: number, input: UserInput): void {
  const values = validate(db, input, id);
  db.update(users).set(values).where(eq(users.id, id)).run();
}

export function deleteUser(db: Db, id: number): void {
  db.delete(users).where(eq(users.id, id)).run();
}

function validate(db: Db, input: UserInput, ownId?: number): UserInput {
  const name = input.name.trim();
  if (!name) throw new UserValidationError('Informe o nome');
  if (!Number.isInteger(input.number) || input.number <= 0) {
    throw new UserValidationError('Número inválido');
  }

  const sameNumber = eq(users.number, input.number);
  const taken = db
    .select({ id: users.id })
    .from(users)
    .where(ownId === undefined ? sameNumber : and(sameNumber, ne(users.id, ownId)))
    .get();
  if (taken) throw new UserValidationError(`Número ${input.number} já cadastrado`);

  return { number: input.number, name };
}
