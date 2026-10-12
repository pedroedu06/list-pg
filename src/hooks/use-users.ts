import { useCallback, useState } from 'react';

import { db } from '@/db/client';
import type { User } from '@/db/schema';
import { createUser, deleteUser, listUsers, updateUser, type UserInput } from '@/db/users';

/** Cadastro de usuários com a lista recarregada após cada alteração. */
export function useUsers() {
  const [users, setUsers] = useState<User[]>(() => listUsers(db));
  const reload = useCallback(() => setUsers(listUsers(db)), []);

  return {
    users,
    create: (input: UserInput) => {
      createUser(db, input);
      reload();
    },
    update: (id: number, input: UserInput) => {
      updateUser(db, id, input);
      reload();
    },
    remove: (id: number) => {
      deleteUser(db, id);
      reload();
    },
  };
}
