import * as Clipboard from 'expo-clipboard';
import { Linking, Share } from 'react-native';

import { copyText, sendToWhatsApp } from './share';

vi.mock('expo-clipboard', () => ({ setStringAsync: vi.fn(async () => true) }));

beforeEach(() => {
  vi.mocked(Clipboard.setStringAsync).mockClear();
  vi.restoreAllMocks();
});

const text = '1 - fulano PG\n3 - beltrano PG';

test('copyText copia para a área de transferência', async () => {
  await copyText(text);

  expect(Clipboard.setStringAsync).toHaveBeenCalledWith(text);
});

test('sendToWhatsApp copia e abre o WhatsApp com a mensagem', async () => {
  const openURL = vi.spyOn(Linking, 'openURL').mockResolvedValue(true);
  const share = vi.spyOn(Share, 'share');

  await sendToWhatsApp(text);

  expect(Clipboard.setStringAsync).toHaveBeenCalledWith(text);
  expect(openURL).toHaveBeenCalledWith(
    'whatsapp://send?text=1%20-%20fulano%20PG%0A3%20-%20beltrano%20PG',
  );
  expect(share).not.toHaveBeenCalled();
});

test('sem WhatsApp, cai no menu de compartilhar', async () => {
  vi.spyOn(Linking, 'openURL').mockRejectedValue(new Error('No app'));
  const share = vi.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' });

  await sendToWhatsApp(text);

  expect(share).toHaveBeenCalledWith({ message: text });
});
