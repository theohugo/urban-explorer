import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';

export function LoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.accent} />
      <Text style={styles.title}>Urban Explorer prepare votre balade</Text>
      <Text style={styles.message}>Recuperation des lieux de Paris et mise en scene de la carte.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
  },
  message: {
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
