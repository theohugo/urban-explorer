import { useDeferredValue, useMemo, useState } from 'react';
import { FlatList, ListRenderItemInfo, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedPlaceCard } from '../components/AnimatedPlaceCard';
import { ErrorState } from '../components/ErrorState';
import { HeroHeader } from '../components/HeroHeader';
import { LoadingState } from '../components/LoadingState';
import { SearchBar } from '../components/SearchBar';
import { usePlaces } from '../context/PlacesContext';
import { COLORS } from '../theme/colors';
import { DiscoveryStackParamList } from '../types/navigation';
import { Place } from '../types/place';

type NavigationProp = NativeStackNavigationProp<DiscoveryStackParamList, 'DiscoveryHome'>;

export function DiscoveryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { places, plannedVisits, isLoading, error, refreshData } = usePlaces();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const filteredPlaces = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    if (!normalized) {
      return places;
    }

    return places.filter((place) => {
      return (
        place.name.toLowerCase().includes(normalized) ||
        place.address.toLowerCase().includes(normalized)
      );
    });
  }, [deferredQuery, places]);

  function renderItem({ item, index }: ListRenderItemInfo<Place>) {
    return (
      <AnimatedPlaceCard
        place={item}
        index={index}
        plannedDate={plannedVisits[item.id]}
        onPress={() => navigation.navigate('PlaceDetail', { place: item })}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={!error ? filteredPlaces : []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshData} tintColor={COLORS.accent} />}
        ListHeaderComponent={
          <>
            <HeroHeader
              title="Decouvrir Paris autrement"
              subtitle="Explorez une selection de lieux culturels de Paris, filtrez par nom et planifiez vos prochaines visites."
            />
            <SearchBar value={query} onChangeText={setQuery} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTitle}>{filteredPlaces.length} lieux affiches</Text>
              <Text style={styles.summaryText}>Lieux deduits depuis Paris Data et disponibles sur la carte</Text>
            </View>
            {isLoading && places.length === 0 ? <LoadingState /> : null}
            {error ? <ErrorState message={error} onRetry={refreshData} /> : null}
            {!isLoading && !error && filteredPlaces.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Aucun lieu ne correspond a votre recherche.</Text>
                <Text style={styles.emptyText}>Essayez un autre nom ou une autre adresse.</Text>
              </View>
            ) : null}
          </>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 18,
    paddingTop: 20,
    paddingBottom: 120,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 18,
    gap: 12,
  },
  summaryTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
  summaryText: {
    color: COLORS.textMuted,
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 16,
  },
  emptyState: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 24,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
  },
  emptyText: {
    color: COLORS.textMuted,
    marginTop: 8,
    lineHeight: 20,
  },
});
