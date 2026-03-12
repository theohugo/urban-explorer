import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { usePlaces } from '../context/PlacesContext';
import { COLORS } from '../theme/colors';

const PARIS_COORDS = {
  latitude: 48.8566,
  longitude: 2.3522,
};

export function MapScreen() {
  const { places } = usePlaces();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState('Carte web indisponible, affichage en liste.');
  const [userCoords, setUserCoords] = useState(PARIS_COORDS);

  useEffect(() => {
    void centerOnUser();
  }, []);

  const markers = useMemo(() => places.slice(0, 30), [places]);

  async function centerOnUser() {
    setLoadingLocation(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setLocationMessage('Position refusee, affichage centre sur Paris.');
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
      setLocationMessage('Position utilisateur activee.');
    } catch {
      setLocationMessage('Geolocalisation indisponible, affichage centre sur Paris.');
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
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.title}>Carte des lieux culturels</Text>
        <Text style={styles.text}>{locationMessage}</Text>
        <Text style={styles.coords}>
          Centre actuel: {userCoords.latitude.toFixed(4)}, {userCoords.longitude.toFixed(4)}
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

      <View style={styles.list}>
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
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    gap: 16,
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
  },
  coords: {
    color: COLORS.accent,
    fontWeight: '700',
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
});
