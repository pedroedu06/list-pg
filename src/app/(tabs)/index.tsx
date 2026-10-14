import { Link, useFocusEffect } from 'expo-router';
import { Alert, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useUsers } from '@/hooks/use-users';

export default function ListaScreen() {
  const { users, reload, setPaid, clearPaid } = useUsers();

  // A Lista fica montada por baixo da tela Editar: recarrega ao voltar dela.
  useFocusEffect(reload);

  function confirmClear() {
    Alert.alert('Limpar checks', 'Desmarcar todos?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: clearPaid },
    ]);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>
            Lista PG
          </ThemedText>
          <Pressable accessibilityRole="button" onPress={confirmClear}>
            <ThemedText type="linkPrimary">Limpar</ThemedText>
          </Pressable>
          <Link href="/editar" asChild>
            <Pressable>
              <ThemedText type="linkPrimary">Editar</ThemedText>
            </Pressable>
          </Link>
        </ThemedView>

        <FlatList
          data={users}
          keyExtractor={(user) => String(user.id)}
          ListEmptyComponent={
            <ThemedText themeColor="textSecondary">
              Nenhum usuário cadastrado. Toque em Editar.
            </ThemedText>
          }
          renderItem={({ item }) => {
            const label = `${item.number} - ${item.name}`;
            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityLabel={label}
                accessibilityState={{ checked: item.paid }}
                onPress={() => setPaid(item.id, !item.paid)}
                style={styles.item}>
                <ThemedText>
                  {item.paid ? '☑' : '☐'} {label}
                </ThemedText>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.three, gap: Spacing.three },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  title: { flex: 1 },
  item: { paddingVertical: Spacing.two },
});
