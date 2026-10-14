import { fireEvent } from '@testing-library/react-native';
import { renderRouter, screen } from 'vitest-expo/router';

import EditarScreen from '../editar';
import ListaScreen from '../index';

test('botão Editar abre o cadastro de usuários', async () => {
  await renderRouter({ index: ListaScreen, editar: EditarScreen }, { initialUrl: '/' });

  expect(screen.getByText('Lista PG')).toBeOnTheScreen();

  await fireEvent.press(screen.getByRole('link', { name: 'Editar' }));

  expect(await screen.findByRole('button', { name: 'Adicionar' })).toBeOnTheScreen();
});
