import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useUsers } from '@/hooks/use-users';
import { formatPaidList } from '@/lib/format-paid-list';
import { copyText, sendToWhatsApp } from '@/lib/share';

export default function PreviaScreen() {
  const { users } = useUsers();
  const text = formatPaidList(users);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await copyText(text);
    setCopied(true);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <ScrollView style={styles.preview}>
          {text ? (
            <ThemedText selectable>{text}</ThemedText>
          ) : (
            <ThemedText themeColor="textSecondary">Ninguém marcado como pago.</ThemedText>
          )}
        </ScrollView>

        {copied && <ThemedText>Lista copiada!</ThemedText>}

        <ThemedView style={styles.buttons}>
          <Button label="Copiar" disabled={!text} onPress={copy} />
          <Button label="Enviar no WhatsApp" disabled={!text} onPress={() => sendToWhatsApp(text)} />
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Button({ label, disabled, onPress }: { label: string; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled]}>
      <ThemedView type="backgroundElement" style={styles.buttonInner}>
        <ThemedText type="smallBold">{label}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.three, gap: Spacing.three },
  preview: { flex: 1 },
  buttons: { flexDirection: 'row', gap: Spacing.two },
  button: { flex: 1 },
  buttonInner: { padding: Spacing.three, borderRadius: Spacing.two, alignItems: 'center' },
  disabled: { opacity: 0.4 },
});
