import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { usePlaces } from '../context/PlacesContext';
import { Memory } from '../types/place';
import { COLORS } from '../theme/colors';

const PARIS_COORDS = {
  latitude: 48.8566,
  longitude: 2.3522,
};
const MAP_TARGET_PLACES = 200;

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MapScreen() {
  const { places, ensurePlacesCount, memories } = usePlaces();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState('Carte web indisponible, affichage en liste.');
  const [userCoords, setUserCoords] = useState(PARIS_COORDS);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    void centerOnUser();
    void ensurePlacesCount(MAP_TARGET_PLACES);
  }, []);

  const markers = useMemo(() => places, [places]);
  const memoryMarkers = useMemo(() => memories.filter((m) => m.location !== null), [memories]);

  async function centerOnUser() {
    setLoadingLocation(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setLocationMessage('Position refusée, affichage centré sur Paris.');
        setUserCoords(PARIS_COORDS);
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserCoords({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });
      setLocationMessage('Position utilisateur activée.');
    } catch {
      setLocationMessage('Géolocalisation indisponible, affichage centré sur Paris.');
      setUserCoords(PARIS_COORDS);
    } finally {
      setLoadingLocation(false);
    }
  }

  function openInMaps(latitude: number, longitude: number, label: string) {
    const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
    void Linking.openURL(url);
    setLocationMessage(`Ouverture de ${label} dans OpenStreetMap.`);
  }

  return (

    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
      <View style={styles.hero}>
        <Text style={styles.title}>Carte culturelle</Text>
        <Text style={styles.text}>{locationMessage}</Text>
        <Text style={styles.text}>
          {markers.length} lieux · {memoryMarkers.length} souvenir{memoryMarkers.length !== 1 ? 's' : ''}
        </Text>

        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={centerOnUser} disabled={loadingLocation}>
            {loadingLocation ? (
              <ActivityIndicator color={COLORS.text} />
            ) : (
              <Text style={styles.buttonText}>Me localiser</Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={() => openInMaps(userCoords.latitude, userCoords.longitude, 'votre position')}
          >
            <Text style={styles.secondaryButtonText}>Ouvrir le centre</Text>
          </Pressable>
        </View>
      </View>

      {/* Section souvenirs */}
      {memoryMarkers.length > 0 && (
        <View style={styles.memoriesSection}>
          <View style={styles.memoriesTitleRow}>
            <View style={styles.secondaryDot} />
            <Text style={styles.memoriesTitle}>Mes souvenirs géolocalisés</Text>
          </View>
          <Text style={styles.memoriesSubtitle}>
            {memoryMarkers.length} souvenir{memoryMarkers.length !== 1 ? 's' : ''} avec une localisation enregistrée
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.memoriesScroll}
          >
            {memoryMarkers.map((memory) => (
              <Pressable
                key={memory.id}
                style={styles.memoryChip}
                onPress={() => setSelectedMemory(memory)}
              >
                <View style={styles.memoryChipImageWrap}>
                  <Image
                    source={{ uri: memory.photoUri }}
                    style={styles.memoryChipImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.memoryChipInfo}>
                  <View style={styles.memoryChipRow}>
                    <Ionicons name="location-sharp" size={11} color={COLORS.secondary} />
                    <Text style={styles.memoryChipAddress} numberOfLines={1}>
                      {memory.location!.address.split(',')[0]}
                    </Text>
                  </View>
                  <Text style={styles.memoryChipDate} numberOfLines={1}>
                    {new Date(memory.timestamp).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Liste lieux */}
      <View style={styles.list}>
        <Text style={styles.sectionLabel}>Lieux culturels</Text>
        {markers.map((place) => (
          <View key={place.id} style={styles.card}>
            <Text style={styles.cardTitle}>{place.name}</Text>
            <Text style={styles.cardText}>{place.address}</Text>
            <Text style={styles.cardMeta}>
              {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
            </Text>
            <Pressable
              style={styles.linkButton}
              onPress={() => openInMaps(place.latitude, place.longitude, place.name)}
            >
              <Text style={styles.linkButtonText}>Voir sur la carte</Text>
            </Pressable>
          </View>
        ))}
      </View>
      </ScrollView>
      {/* Modal souvenir */}
      <Modal
        visible={selectedMemory !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMemory(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setSelectedMemory(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            {selectedMemory && (
              <>
                <Image
                  source={{ uri: selectedMemory.photoUri }}
                  style={styles.modalPhoto}
                  resizeMode="cover"
                />
                <View style={styles.modalHandle} />
                <View style={styles.modalBody}>
                  <View style={styles.modalRow}>
                    <Ionicons name="time-outline" size={15} color={COLORS.primary} />
                    <Text style={styles.modalDate}>{formatDate(selectedMemory.timestamp)}</Text>
                  </View>

                  {selectedMemory.location && (
                    <View style={styles.modalLocationBlock}>
                      <Ionicons name="location-sharp" size={15} color={COLORS.secondary} />
                      <Text style={styles.modalAddress}>{selectedMemory.location.address}</Text>
                    </View>
                  )}

                  {selectedMemory.location && (
                    <Pressable
                      style={styles.openMapsButton}
                      onPress={() =>
                        openInMaps(
                          selectedMemory.location!.latitude,
                          selectedMemory.location!.longitude,
                          'ce souvenir'
                        )
                      }
                    >
                      <Ionicons name="map-outline" size={14} color={COLORS.textDark} />
                      <Text style={styles.openMapsText}>Voir sur OpenStreetMap</Text>
                    </Pressable>
                  )}

                  {selectedMemory.note ? (
                    <Text style={styles.modalNote}>{selectedMemory.note}</Text>
                  ) : null}
                </View>

                <Pressable style={styles.closeButton} onPress={() => setSelectedMemory(null)}>
                  <Ionicons name="close" size={18} color={COLORS.text} />
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 16,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    padding: 18,
    gap: 10,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '800',
  },
  text: {
    color: COLORS.textMuted,
    lineHeight: 20,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontWeight: '700',
  },

  /* ── Section souvenirs ── */
  memoriesSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    gap: 12,
  },
  memoriesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  secondaryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
  },
  memoriesTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
  },
  memoriesSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  memoriesScroll: {
    gap: 10,
    paddingRight: 4,
  },
  memoryChip: {
    width: 130,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  memoryChipImageWrap: {
    width: '100%',
    height: 100,
  },
  memoryChipImage: {
    width: '100%',
    height: '100%',
  },
  memoryChipInfo: {
    padding: 8,
    gap: 4,
  },
  memoryChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memoryChipAddress: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  memoryChipDate: {
    color: COLORS.textMuted,
    fontSize: 10,
  },

  /* ── Liste lieux ── */
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    gap: 8,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
  cardText: {
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  cardMeta: {
    color: COLORS.accent,
    fontWeight: '700',
    fontSize: 12,
  },
  linkButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.cardSoft,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  linkButtonText: {
    color: COLORS.textDark,
    fontWeight: '800',
  },

  /* ── Modal souvenir ── */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 12, 20, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  modalPhoto: {
    width: '100%',
    height: 300,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  modalBody: {
    padding: 20,
    paddingTop: 10,
    gap: 10,
    paddingBottom: 40,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  modalDate: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  modalLocationBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    backgroundColor: 'rgba(90, 209, 201, 0.10)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(90, 209, 201, 0.20)',
  },
  modalAddress: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    lineHeight: 20,
  },
  openMapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.cardSoft,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  openMapsText: {
    color: COLORS.textDark,
    fontWeight: '800',
    fontSize: 13,
  },
  modalNote: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 19,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(3,12,20,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
