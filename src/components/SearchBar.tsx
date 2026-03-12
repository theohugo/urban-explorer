import { StyleSheet, TextInput, View } from 'react-native';
import { COLORS } from '../theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Rechercher un lieu, un musee, un parc..."
        placeholderTextColor={COLORS.textMuted}
        style={styles.input}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    color: COLORS.text,
    fontSize: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
});
