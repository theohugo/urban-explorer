import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';

interface HeroHeaderProps {
  title: string;
  subtitle: string;
}

export function HeroHeader({ title, subtitle }: HeroHeaderProps) {
  return (
    <LinearGradient colors={['#12324A', '#0A1828']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <Text style={styles.eyebrow}>Urban Explorer</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  eyebrow: {
    color: COLORS.secondary,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    fontSize: 12,
    marginBottom: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 36,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
});
