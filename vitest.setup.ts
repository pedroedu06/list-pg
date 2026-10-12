// O expo-sqlite não roda em Node: nos testes, o banco do app vira um SQLite em memória.
vi.mock('@/db/client', async () => {
  const { createTestDb } = await import('@/db/test-db');
  return { db: createTestDb() };
});
