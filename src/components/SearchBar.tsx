import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Rechercher un lieu, un musee, un parc..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 18,
    paddingVertical: 2,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 14,
  },
});
