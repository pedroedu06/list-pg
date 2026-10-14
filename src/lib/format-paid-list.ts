import type { User } from '@/db/schema';

/** Texto para o WhatsApp: só quem pagou, ordenado pelo número ("1 - fulano PG"). */
export function formatPaidList(users: User[]): string {
  return users
    .filter((user) => user.paid)
    .sort((a, b) => a.number - b.number)
    .map((user) => `${user.number} - ${user.name} PG`)
    .join('\n');
}
