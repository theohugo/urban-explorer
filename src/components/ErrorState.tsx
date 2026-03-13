import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Connexion interrompue</Text>
      <Text style={styles.title}>Impossible de charger les adresses culturelles</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Reessayer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    marginTop: 28,
    padding: 24,
    gap: 10,
  },
  eyebrow: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
  },
  message: {
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  button: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: 'rgba(255, 122, 89, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 89, 0.26)',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: '800',
  },
});
