import { act, fireEvent } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import { Alert, type AlertButton } from 'react-native';
import { renderRouter, screen, testRouter } from 'vitest-expo/router';

import { db } from '@/db/client';
import { users } from '@/db/schema';
import { createUser, listUsers, setPaid } from '@/db/users';
import EditarScreen from '../editar';
import ListaScreen from '../(tabs)/index';

beforeEach(() => {
  db.delete(users).run();
  vi.restoreAllMocks();
});

// Com Stack, como no app: a Lista continua montada por baixo da tela Editar.
function renderLista() {
  return renderRouter(
    { _layout: () => <Stack />, index: ListaScreen, editar: EditarScreen },
    { initialUrl: '/' },
  );
}

const check = (name: string) => screen.getByRole('checkbox', { name });

/** Faz o Alert.alert de confirmação apertar o botão com o texto dado. */
function respondAlertWith(buttonText: string) {
  vi.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons?: AlertButton[]) => {
    buttons?.find((b) => b.text === buttonText)?.onPress?.();
  });
}

test('mostra os usuários do banco em ordem, com o check do pagamento', async () => {
  createUser(db, { number: 2, name: 'Siclano' });
  const fulano = createUser(db, { number: 1, name: 'Fulano' });
  setPaid(db, fulano.id, true);

  await renderLista();

  const rows = screen.getAllByRole('checkbox');
  expect(rows.map((r) => r.props.accessibilityLabel)).toEqual(['1 - Fulano', '2 - Siclano']);
  expect(check('1 - Fulano')).toBeChecked();
  expect(check('2 - Siclano')).not.toBeChecked();
});

test('tocar no check marca e desmarca, gravando no banco', async () => {
  createUser(db, { number: 1, name: 'Fulano' });
  await renderLista();

  await fireEvent.press(check('1 - Fulano'));
  expect(check('1 - Fulano')).toBeChecked();
  expect(listUsers(db)[0].paid).toBe(true);

  await fireEvent.press(check('1 - Fulano'));
  expect(check('1 - Fulano')).not.toBeChecked();
  expect(listUsers(db)[0].paid).toBe(false);
});

test('Limpar desmarca todos depois de confirmar', async () => {
  const fulano = createUser(db, { number: 1, name: 'Fulano' });
  const siclano = createUser(db, { number: 2, name: 'Siclano' });
  setPaid(db, fulano.id, true);
  setPaid(db, siclano.id, true);
  await renderLista();
  respondAlertWith('Limpar');

  await fireEvent.press(screen.getByRole('button', { name: 'Limpar' }));

  expect(check('1 - Fulano')).not.toBeChecked();
  expect(check('2 - Siclano')).not.toBeChecked();
  expect(listUsers(db).map((u) => u.paid)).toEqual([false, false]);
});

test('Cancelar no Limpar mantém os checks', async () => {
  const fulano = createUser(db, { number: 1, name: 'Fulano' });
  setPaid(db, fulano.id, true);
  await renderLista();
  respondAlertWith('Cancelar');

  await fireEvent.press(screen.getByRole('button', { name: 'Limpar' }));

  expect(check('1 - Fulano')).toBeChecked();
});

test('quem foi cadastrado em Editar aparece ao voltar para a Lista', async () => {
  await renderLista();
  expect(screen.getByText(/Nenhum usuário cadastrado/)).toBeOnTheScreen();

  await fireEvent.press(screen.getByRole('link', { name: 'Editar' }));
  await fireEvent.changeText(await screen.findByLabelText('Número'), '5');
  await fireEvent.changeText(screen.getByLabelText('Nome'), 'Beltrano');
  await fireEvent.press(screen.getByRole('button', { name: 'Adicionar' }));
  await act(() => testRouter.back());

  expect(await screen.findByRole('checkbox', { name: '5 - Beltrano' })).toBeOnTheScreen();
});
