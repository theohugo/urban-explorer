import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { usePlaces } from '../context/PlacesContext';
import { COLORS } from '../theme/colors';

const PARIS_REGION: Region = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

export function MapScreen() {
  const { places } = usePlaces();
  const [region, setRegion] = useState<Region>(PARIS_REGION);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState('Carte centree sur Paris.');

  useEffect(() => {
    void centerOnUser();
  }, []);

  const markers = useMemo(() => places.slice(0, 30), [places]);

  async function centerOnUser() {
    setLoadingLocation(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setLocationMessage('Position refusee, affichage de Paris par defaut.');
        setRegion(PARIS_REGION);
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setRegion({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.09,
      });
      setLocationMessage('Position utilisateur activee.');
    } catch {
      setLocationMessage('Geolocalisation indisponible, retour sur Paris.');
      setRegion(PARIS_REGION);
    } finally {
      setLoadingLocation(false);
    }
  }

  return (
    <View style={styles.screen}>
      <MapView style={styles.map} initialRegion={region} region={region} onRegionChangeComplete={setRegion}>
        {markers.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.name}
            description={place.address}
            pinColor={COLORS.primary}
          />
        ))}
      </MapView>

      <View style={styles.overlay}>
        <Text style={styles.overlayTitle}>Carte des lieux culturels</Text>
        <Text style={styles.overlayText}>{locationMessage}</Text>

        <Pressable style={styles.button} onPress={centerOnUser} disabled={loadingLocation}>
          {loadingLocation ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.buttonText}>Me localiser</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 54,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(7, 19, 31, 0.86)',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    gap: 8,
  },
  overlayTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
  },
  overlayText: {
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: '800',
  },
});
