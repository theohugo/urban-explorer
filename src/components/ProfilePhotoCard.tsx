import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';

interface ProfilePhotoCardProps {
  imageUri: string | null;
  onTakePhoto: () => void;
  onClear: () => void;
}

export function ProfilePhotoCard({ imageUri, onTakePhoto, onClear }: ProfilePhotoCardProps) {
  return (
    <LinearGradient
      colors={['#12324A', '#0A1828']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.kicker}>Mon profil</Text>
          <Text style={styles.title}>Selfie souvenir</Text>
          <Text style={styles.description}>
            Capturez un portrait depuis l'application et gardez-le comme repere personnel.
          </Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="camera-outline" size={18} color={COLORS.accent} />
        </View>
      </View>

      <View style={styles.avatarShell}>
        <View style={styles.avatarGlow} />
        <View style={styles.avatarFrame}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="person-outline" size={34} color={COLORS.textMuted} />
              <Text style={styles.placeholderText}>Aucune photo</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={onTakePhoto}>
          <Ionicons name="camera" size={18} color={COLORS.textDark} />
          <Text style={styles.primaryButtonText}>
            {imageUri ? 'Changer le selfie' : 'Prendre un selfie'}
          </Text>
        </Pressable>

        {imageUri ? (
          <Pressable style={styles.secondaryButton} onPress={onClear}>
            <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.secondaryButtonText}>Supprimer la photo</Text>
          </Pressable>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 22,
    gap: 18,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  titleBlock: {
    flex: 1,
    gap: 8,
  },
  kicker: {
    color: COLORS.secondary,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 1.2,
    fontSize: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '900',
  },
  description: {
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 201, 93, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 201, 93, 0.22)',
  },
  avatarShell: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  avatarGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(90, 209, 201, 0.08)',
  },
  avatarFrame: {
    borderRadius: 999,
    padding: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 999,
  },
  placeholder: {
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  placeholderText: {
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  actions: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonText: {
    color: COLORS.textDark,
    fontWeight: '900',
    fontSize: 15,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(7, 19, 31, 0.22)',
  },
  secondaryButtonText: {
    color: COLORS.textMuted,
    fontWeight: '700',
  },
});
