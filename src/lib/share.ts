import * as Clipboard from 'expo-clipboard';
import { Linking, Share } from 'react-native';

export async function copyText(text: string): Promise<void> {
  await Clipboard.setStringAsync(text);
}

/** Copia e abre o WhatsApp com a mensagem; sem WhatsApp, abre o menu de compartilhar. */
export async function sendToWhatsApp(text: string): Promise<void> {
  await copyText(text);
  try {
    await Linking.openURL(`whatsapp://send?text=${encodeURIComponent(text)}`);
  } catch {
    await Share.share({ message: text });
  }
}
