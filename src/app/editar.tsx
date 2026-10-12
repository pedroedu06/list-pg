import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { User } from '@/db/schema';
import { UserValidationError } from '@/db/users';
import { useTheme } from '@/hooks/use-theme';
import { useUsers } from '@/hooks/use-users';

export default function EditarScreen() {
  const theme = useTheme();
  const { users, create, update, remove } = useUsers();
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setNumber('');
    setName('');
    setEditingId(null);
    setError(null);
  }

  function submit() {
    const input = { number: Number(number), name };
    try {
      if (editingId === null) create(input);
      else update(editingId, input);
      resetForm();
    } catch (e) {
      if (!(e instanceof UserValidationError)) throw e;
      setError(e.message);
    }
  }

  function startEditing(user: User) {
    setNumber(String(user.number));
    setName(user.name);
    setEditingId(user.id);
    setError(null);
  }

  function removeUser(user: User) {
    remove(user.id);
    if (editingId === user.id) resetForm();
  }

  const inputStyle = [styles.input, { color: theme.text, borderColor: theme.textSecondary }];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.form}>
        <TextInput
          accessibilityLabel="Número"
          placeholder="Número"
          placeholderTextColor={theme.textSecondary}
          keyboardType="number-pad"
          value={number}
          onChangeText={setNumber}
          style={[inputStyle, styles.numberInput]}
        />
        <TextInput
          accessibilityLabel="Nome"
          placeholder="Nome"
          placeholderTextColor={theme.textSecondary}
          value={name}
          onChangeText={setName}
          onSubmitEditing={submit}
          style={[inputStyle, styles.nameInput]}
        />
      </ThemedView>

      <ThemedView style={styles.row}>
        <Button label={editingId === null ? 'Adicionar' : 'Salvar'} onPress={submit} />
        {editingId !== null && <Button label="Cancelar" onPress={resetForm} />}
      </ThemedView>

      {error && <ThemedText style={styles.error}>{error}</ThemedText>}

      <FlatList
        data={users}
        keyExtractor={(user) => String(user.id)}
        ListEmptyComponent={<ThemedText themeColor="textSecondary">Nenhum usuário cadastrado</ThemedText>}
        renderItem={({ item }) => (
          <ThemedView style={[styles.row, styles.item]}>
            <ThemedText style={styles.itemText}>
              {item.number} - {item.name}
            </ThemedText>
            <Button label="Editar" a11yLabel={`Editar ${item.name}`} onPress={() => startEditing(item)} />
            <Button label="Excluir" a11yLabel={`Excluir ${item.name}`} onPress={() => removeUser(item)} />
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

function Button({ label, a11yLabel, onPress }: { label: string; a11yLabel?: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={a11yLabel ?? label} onPress={onPress}>
      <ThemedText type="linkPrimary">{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.three, gap: Spacing.two },
  form: { flexDirection: 'row', gap: Spacing.two },
  input: { borderWidth: 1, borderRadius: Spacing.one, padding: Spacing.two, fontSize: 16 },
  numberInput: { width: 90 },
  nameInput: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  item: { paddingVertical: Spacing.two },
  itemText: { flex: 1 },
  error: { color: '#d32f2f' },
});
