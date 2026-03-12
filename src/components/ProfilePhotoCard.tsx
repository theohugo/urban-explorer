import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';

interface ProfilePhotoCardProps {
  imageUri: string | null;
  onTakePhoto: () => void;
  onClear: () => void;
}

export function ProfilePhotoCard({ imageUri, onTakePhoto, onClear }: ProfilePhotoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>Mon profil</Text>
      <Text style={styles.title}>Selfie souvenir</Text>
      <Text style={styles.description}>
        Prenez une photo depuis l'application et conservez-la comme avatar local.
      </Text>

      <View style={styles.avatarFrame}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Aucune photo</Text>
          </View>
        )}
      </View>

      <Pressable style={styles.primaryButton} onPress={onTakePhoto}>
        <Text style={styles.primaryButtonText}>Prendre un selfie</Text>
      </Pressable>

      {imageUri ? (
        <Pressable style={styles.secondaryButton} onPress={onClear}>
          <Text style={styles.secondaryButtonText}>Supprimer la photo</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardSoft,
    borderRadius: 28,
    padding: 22,
    gap: 12,
  },
  kicker: {
    color: COLORS.primary,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 1.2,
    fontSize: 12,
  },
  title: {
    color: COLORS.textDark,
    fontSize: 28,
    fontWeight: '900',
  },
  description: {
    color: COLORS.textSoftDark,
    lineHeight: 22,
  },
  avatarFrame: {
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 999,
    padding: 8,
    backgroundColor: '#FFE7DE',
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
    backgroundColor: '#EDDCD0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: COLORS.textSoftDark,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: COLORS.textDark,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#E7C4B8',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.textDark,
    fontWeight: '700',
  },
});
