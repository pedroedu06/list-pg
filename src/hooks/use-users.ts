import { useCallback, useState } from 'react';

import { db } from '@/db/client';
import type { User } from '@/db/schema';
import {
  clearPaid,
  createUser,
  deleteUser,
  listUsers,
  setPaid,
  updateUser,
  type UserInput,
} from '@/db/users';

/** Usuários do banco, com a lista recarregada após cada alteração. */
export function useUsers() {
  const [users, setUsers] = useState<User[]>(() => listUsers(db));
  const reload = useCallback(() => setUsers(listUsers(db)), []);

  return {
    users,
    reload,
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
    setPaid: (id: number, paid: boolean) => {
      setPaid(db, id, paid);
      reload();
    },
    clearPaid: () => {
      clearPaid(db);
      reload();
    },
  };
}
