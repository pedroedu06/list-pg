import { fireEvent, render, screen } from '@testing-library/react-native';

import { db } from '@/db/client';
import { users } from '@/db/schema';
import { createUser } from '@/db/users';
import EditarScreen from '../editar';

beforeEach(() => {
  db.delete(users).run();
});

async function preencher(numero: string, nome: string) {
  await fireEvent.changeText(screen.getByLabelText('Número'), numero);
  await fireEvent.changeText(screen.getByLabelText('Nome'), nome);
}

test('adiciona um usuário e mostra na lista', async () => {
  await render(<EditarScreen />);

  await preencher('7', 'Fulano');
  await fireEvent.press(screen.getByRole('button', { name: 'Adicionar' }));

  expect(screen.getByText('7 - Fulano')).toBeOnTheScreen();
  expect(screen.getByLabelText('Número')).toHaveDisplayValue('');
  expect(screen.getByLabelText('Nome')).toHaveDisplayValue('');
});

test('edita um usuário', async () => {
  createUser(db, { number: 1, name: 'Fulano' });
  await render(<EditarScreen />);

  await fireEvent.press(screen.getByRole('button', { name: 'Editar Fulano' }));
  expect(screen.getByLabelText('Nome')).toHaveDisplayValue('Fulano');

  await fireEvent.changeText(screen.getByLabelText('Nome'), 'Fulano da Silva');
  await fireEvent.press(screen.getByRole('button', { name: 'Salvar' }));

  expect(screen.getByText('1 - Fulano da Silva')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'Adicionar' })).toBeOnTheScreen();
});

test('cancela a edição', async () => {
  createUser(db, { number: 1, name: 'Fulano' });
  await render(<EditarScreen />);

  await fireEvent.press(screen.getByRole('button', { name: 'Editar Fulano' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Cancelar' }));

  expect(screen.getByLabelText('Nome')).toHaveDisplayValue('');
  expect(screen.getByRole('button', { name: 'Adicionar' })).toBeOnTheScreen();
});

test('exclui um usuário', async () => {
  createUser(db, { number: 1, name: 'Fulano' });
  createUser(db, { number: 2, name: 'Siclano' });
  await render(<EditarScreen />);

  await fireEvent.press(screen.getByRole('button', { name: 'Excluir Fulano' }));

  expect(screen.queryByText('1 - Fulano')).not.toBeOnTheScreen();
  expect(screen.getByText('2 - Siclano')).toBeOnTheScreen();
});

test('mostra erro de número já cadastrado', async () => {
  createUser(db, { number: 1, name: 'Fulano' });
  await render(<EditarScreen />);

  await preencher('1', 'Siclano');
  await fireEvent.press(screen.getByRole('button', { name: 'Adicionar' }));

  expect(screen.getByText('Número 1 já cadastrado')).toBeOnTheScreen();
  expect(screen.queryByText('1 - Siclano')).not.toBeOnTheScreen();
});
