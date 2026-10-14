import { fireEvent, render, screen } from '@testing-library/react-native';

import { db } from '@/db/client';
import { users } from '@/db/schema';
import { createUser, setPaid } from '@/db/users';
import { copyText, sendToWhatsApp } from '@/lib/share';
import PreviaScreen from '../previa';

vi.mock('@/lib/share', () => ({
  copyText: vi.fn(async () => {}),
  sendToWhatsApp: vi.fn(async () => {}),
}));

beforeEach(() => {
  db.delete(users).run();
  vi.mocked(copyText).mockClear();
  vi.mocked(sendToWhatsApp).mockClear();
});

const texto = '1 - fulano PG\n3 - beltrano PG';

function cadastrarComPagamentos() {
  setPaid(db, createUser(db, { number: 3, name: 'beltrano' }).id, true);
  createUser(db, { number: 2, name: 'siclano' });
  setPaid(db, createUser(db, { number: 1, name: 'fulano' }).id, true);
}

test('mostra só quem pagou, no formato da mensagem', async () => {
  cadastrarComPagamentos();
  await render(<PreviaScreen />);

  expect(screen.getByText(texto)).toBeOnTheScreen();
  expect(screen.queryByText(/siclano/)).not.toBeOnTheScreen();
});

test('Copiar copia o texto e avisa', async () => {
  cadastrarComPagamentos();
  await render(<PreviaScreen />);

  await fireEvent.press(screen.getByRole('button', { name: 'Copiar' }));

  expect(copyText).toHaveBeenCalledWith(texto);
  expect(await screen.findByText('Lista copiada!')).toBeOnTheScreen();
});

test('Enviar no WhatsApp manda o texto', async () => {
  cadastrarComPagamentos();
  await render(<PreviaScreen />);

  await fireEvent.press(screen.getByRole('button', { name: 'Enviar no WhatsApp' }));

  expect(sendToWhatsApp).toHaveBeenCalledWith(texto);
});

test('ninguém pago: avisa e desabilita os botões', async () => {
  createUser(db, { number: 1, name: 'fulano' });
  await render(<PreviaScreen />);

  expect(screen.getByText('Ninguém marcado como pago.')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'Copiar' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Enviar no WhatsApp' })).toBeDisabled();

  await fireEvent.press(screen.getByRole('button', { name: 'Copiar' }));
  expect(copyText).not.toHaveBeenCalled();
});
