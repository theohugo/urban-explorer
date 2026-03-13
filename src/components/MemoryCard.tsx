import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Memory } from '../types/place';
import { COLORS } from '../theme/colors';

interface MemoryCardProps {
  memory: Memory;
  onDelete: (id: string) => void;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MemoryCard({ memory, onDelete }: MemoryCardProps) {
  function handleDelete() {
    Alert.alert('Supprimer ce souvenir ?', 'Cette action est irréversible.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => onDelete(memory.id) },
    ]);
  }

  return (
    <View style={styles.card}>
      <Image source={{ uri: memory.photoUri }} style={styles.photo} resizeMode="cover" />

      <View style={styles.info}>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={13} color={COLORS.primary} />
          <Text style={styles.date}>{formatDate(memory.timestamp)}</Text>
        </View>

        {memory.location ? (
          <View style={styles.row}>
            <Ionicons name="location-sharp" size={13} color={COLORS.secondary} />
            <Text style={styles.address} numberOfLines={2}>
              {memory.location.address}
            </Text>
          </View>
        ) : (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={13} color={COLORS.textSoftDark} />
            <Text style={styles.addressMuted}>Localisation non disponible</Text>
          </View>
        )}

        {memory.note ? <Text style={styles.note}>{memory.note}</Text> : null}
      </View>

      <Pressable style={styles.deleteButton} onPress={handleDelete} hitSlop={8}>
        <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  photo: {
    width: 100,
    height: 110,
  },
  info: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  date: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  address: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    lineHeight: 17,
  },
  addressMuted: {
    color: COLORS.textSoftDark,
    fontSize: 12,
    fontStyle: 'italic',
  },
  note: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 17,
    marginTop: 2,
  },
  deleteButton: {
    padding: 10,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 125, 125, 0.10)',
    borderBottomLeftRadius: 12,
  },
});
