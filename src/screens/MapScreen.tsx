import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { usePlaces } from '../context/PlacesContext';
import { Memory } from '../types/place';
import { COLORS } from '../theme/colors';

const PARIS_REGION: Region = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
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
  const [region, setRegion] = useState<Region>(PARIS_REGION);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState('Carte centrée sur Paris.');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    void ensurePlacesCount(MAP_TARGET_PLACES);
  }, []);

  const markers = useMemo(() => places, [places]);

  const memoryMarkers = useMemo(
    () => memories.filter((m) => m.location !== null),
    [memories]
  );

  async function centerOnUser() {
    setLoadingLocation(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setLocationMessage('Position refusée, affichage de Paris par défaut.');
        setUserLocation(null);
        setRegion(PARIS_REGION);
        Alert.alert(
          'Permission refusée',
          "Pour utiliser la géolocalisation, vous devez autoriser l'accès à votre position dans les paramètres.",
          [{ text: 'OK' }]
        );
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userCoords = {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      };

      setUserLocation(userCoords);
      setRegion({
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.09,
      });
      setLocationMessage('Position utilisateur activée.');
    } catch {
      setLocationMessage('Géolocalisation indisponible, retour sur Paris.');
      setRegion(PARIS_REGION);
    } finally {
      setLoadingLocation(false);
    }
  }

  return (
    <View style={styles.screen}>
      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {/* Position utilisateur */}
        {userLocation && (
          <Marker coordinate={userLocation} title="Ma position" pinColor={COLORS.text} />
        )}

        {/* Lieux culturels */}
        {markers.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.name}
            description={place.address}
            pinColor={COLORS.primary}
          />
        ))}

        {/* Souvenirs photo style Snapchat */}
        {memoryMarkers.map((memory) => (
          <Marker
            key={memory.id}
            coordinate={{
              latitude: memory.location!.latitude,
              longitude: memory.location!.longitude,
            }}
            onPress={() => setSelectedMemory(memory)}
            tracksViewChanges={false}
          >
            <View style={styles.memoryPin}>
              <View style={styles.memoryPinRing}>
                <Image
                  source={{ uri: memory.photoUri }}
                  style={styles.memoryPinPhoto}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.memoryPinTip} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Overlay info */}
      <View style={styles.overlay}>
        <View style={styles.overlayRow}>
          <View style={styles.overlayLeft}>
            <Text style={styles.overlayTitle}>Carte culturelle</Text>
            <Text style={styles.overlayText}>{locationMessage}</Text>
            <Text style={styles.overlayText}>{markers.length} lieux · {memoryMarkers.length} souvenir{memoryMarkers.length !== 1 ? 's' : ''}</Text>
          </View>

          <Pressable style={styles.locateButton} onPress={centerOnUser} disabled={loadingLocation}>
            {loadingLocation ? (
              <ActivityIndicator color={COLORS.text} size="small" />
            ) : (
              <Ionicons name="navigate" size={18} color={COLORS.text} />
            )}
          </Pressable>
        </View>

        {memoryMarkers.length > 0 && (
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendText}>Lieux culturels</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.secondary }]} />
              <Text style={styles.legendText}>Mes souvenirs</Text>
            </View>
          </View>
        )}
      </View>
      {/* Modal détail souvenir */}
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
  map: {
    flex: 1,
  },

  /* ── Memory pin Snapchat style ── */
  memoryPin: {
    alignItems: 'center',
  },
  memoryPinRing: {
    width: 58,
    height: 58,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: COLORS.secondary,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: COLORS.surface,
  },
  memoryPinPhoto: {
    width: '100%',
    height: '100%',
  },
  memoryPinTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.secondary,
    marginTop: -1,
  },

  /* ── Overlay ── */
  overlay: {
    position: 'absolute',
    top: 54,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(7, 19, 31, 0.90)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    gap: 10,
  },
  overlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  overlayLeft: {
    flex: 1,
    gap: 3,
  },
  overlayTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '800',
  },
  overlayText: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  locateButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
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
    height: 320,
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
