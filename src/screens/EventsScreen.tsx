import { useDeferredValue, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native';
import { ErrorState } from '../components/ErrorState';
import { HeroHeader } from '../components/HeroHeader';
import { LoadingState } from '../components/LoadingState';
import { SearchBar } from '../components/SearchBar';
import { usePlaces } from '../context/PlacesContext';
import { COLORS } from '../theme/colors';
import { EventItem } from '../types/place';

export function EventsScreen() {
  const { events, isLoading, isLoadingMoreEvents, error, refreshData, loadMoreEvents } = usePlaces();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const filteredEvents = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    if (!normalized) {
      return events;
    }

    return events.filter((event) => {
      return (
        event.title.toLowerCase().includes(normalized) ||
        event.venueName.toLowerCase().includes(normalized) ||
        event.category.toLowerCase().includes(normalized)
      );
    });
  }, [deferredQuery, events]);

  function openEvent(url: string | null) {
    if (url) {
      void Linking.openURL(url);
    }
  }

  function renderItem({ item }: { item: EventItem }) {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.body}>
          <View style={styles.row}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.price}>{item.priceLabel}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.venue}>{item.venueName}</Text>
          <Text style={styles.text}>{item.summary}</Text>
          <Text style={styles.meta}>{item.dateLabel.replace(/<br \/>/g, ' ')}</Text>
          <Text style={styles.meta}>{item.address}</Text>
          <Text style={styles.audience}>{item.audience}</Text>
          <Pressable style={styles.button} onPress={() => openEvent(item.detailsUrl)} disabled={!item.detailsUrl}>
            <Text style={styles.buttonText}>Voir l evenement</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={!error ? filteredEvents : []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (!deferredQuery.trim()) {
            void loadMoreEvents();
          }
        }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshData} tintColor={COLORS.accent} />}
        ListFooterComponent={
          isLoadingMoreEvents ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={COLORS.accent} />
            </View>
          ) : null
        }
        ListHeaderComponent={
          <>
            <HeroHeader
              title="Evenements a Paris"
              subtitle="Concerts, theatre, expos et autres sorties recuperees depuis le dataset officiel Que Faire a Paris."
            />
            <SearchBar value={query} onChangeText={setQuery} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTitle}>{filteredEvents.length} evenements affiches</Text>
              <Text style={styles.summaryText}>API Explore v2.1 Paris Data</Text>
            </View>
            {isLoading && events.length === 0 ? <LoadingState /> : null}
            {error ? <ErrorState message={error} onRetry={refreshData} /> : null}
          </>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 16,
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
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: 18,
  },
  image: {
    width: '100%',
    height: 180,
  },
  body: {
    padding: 18,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  category: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  price: {
    color: COLORS.textSoftDark,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: COLORS.textDark,
    fontSize: 22,
    fontWeight: '800',
  },
  venue: {
    color: COLORS.textDark,
    fontWeight: '700',
  },
  text: {
    color: COLORS.textSoftDark,
    lineHeight: 22,
  },
  meta: {
    color: COLORS.textSoftDark,
    lineHeight: 20,
  },
  audience: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  button: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.textDark,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: '800',
  },
  footerLoader: {
    paddingVertical: 12,
  },
});
