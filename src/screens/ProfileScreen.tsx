import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { HeroHeader } from '../components/HeroHeader';
import { MemoryCard } from '../components/MemoryCard';
import { ProfilePhotoCard } from '../components/ProfilePhotoCard';
import { usePlaces } from '../context/PlacesContext';
import { COLORS } from '../theme/colors';
import { Memory } from '../types/place';

export function ProfileScreen() {
  const {
    profilePhotoUri,
    setProfilePhoto,
    memories,
    addMemory,
    deleteMemory,
    places,
    plannedVisits,
    deletePlannedVisit,
  } = usePlaces();

  async function handleTakePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission refusee', "L'application a besoin de la camera pour prendre un selfie.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      await setProfilePhoto(uri);

      const location = await resolveLocation();
      await addMemory({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        photoUri: uri,
        location,
        timestamp: new Date().toISOString(),
        note: 'Selfie souvenir',
      });
    }
  }

  async function handleClearPhoto() {
    await setProfilePhoto(null);
  }

  async function resolveLocation(): Promise<Memory['location']> {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        return null;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const geocoded = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });

      const place = geocoded[0];
      const parts = [place?.name, place?.street, place?.postalCode, place?.city].filter(Boolean);
      const address =
        parts.length > 0
          ? parts.join(', ')
          : `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;

      return {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        address,
      };
    } catch {
      return null;
    }
  }

  async function handleAddMemoryFromCamera() {
    const camPerm = await ImagePicker.requestCameraPermissionsAsync();

    if (!camPerm.granted) {
      Alert.alert('Permission refusee', "L'application a besoin de la camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (result.canceled || !result.assets[0]?.uri) {
      return;
    }

    const location = await resolveLocation();

    const memory: Memory = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      photoUri: result.assets[0].uri,
      location,
      timestamp: new Date().toISOString(),
    };

    await addMemory(memory);
  }

  async function handleAddMemoryFromGallery() {
    const galPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!galPerm.granted) {
      Alert.alert('Permission refusee', "L'application a besoin d'acceder a votre galerie.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (result.canceled || !result.assets[0]?.uri) {
      return;
    }

    const location = await resolveLocation();

    const memory: Memory = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      photoUri: result.assets[0].uri,
      location,
      timestamp: new Date().toISOString(),
    };

    await addMemory(memory);
  }

  function handleAddMemory() {
    Alert.alert('Ajouter un souvenir', 'Comment souhaitez-vous ajouter une photo ?', [
      { text: 'Prendre une photo', onPress: handleAddMemoryFromCamera },
      { text: 'Choisir dans la galerie', onPress: handleAddMemoryFromGallery },
      { text: 'Annuler', style: 'cancel' },
    ]);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <HeroHeader
          title="Votre carnet de souvenirs"
          subtitle="Capturez vos moments preferes avec leur localisation exacte et conservez-les dans votre bibliotheque personnelle."
        />

        <ProfilePhotoCard
          imageUri={profilePhotoUri}
          onTakePhoto={handleTakePhoto}
          onClear={handleClearPhoto}
        />

        <View style={styles.reservationsSection}>
          <View style={styles.reservationsHeader}>
            <Text style={styles.reservationsKicker}>Mes visites prevues</Text>
          </View>
          <Text style={styles.reservationsTitle}>Reservations</Text>

          {Object.entries(plannedVisits).length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={40} color={COLORS.border} />
              <Text style={styles.emptyTitle}>Aucune reservation</Text>
              <Text style={styles.emptySubtitle}>
                Planifiez une visite dans la page Decouverte ou sur la Carte pour voir vos reservations ici.
              </Text>
            </View>
          ) : (
            <View style={styles.reservationsList}>
              {Object.entries(plannedVisits).map(([placeId, visit]) => {
                const place = places.find((p) => p.id === placeId);
                if (!place) {
                  return null;
                }

                return (
                  <View key={placeId} style={styles.reservationCard}>
                    <View style={styles.reservationInfo}>
                      <Text style={styles.reservationPlace}>{place.name}</Text>
                      <View style={styles.reservationDateTime}>
                        <Ionicons name="calendar" size={14} color={COLORS.textMuted} />
                        <Text style={styles.reservationDate}>{visit.date} a {visit.time}</Text>
                      </View>
                    </View>

                    <Pressable
                      style={styles.deleteReservationButton}
                      onPress={() => {
                        Alert.alert(
                          'Supprimer la reservation',
                          `Etes-vous sur de vouloir annuler la visite de ${place.name} ?`,
                          [
                            { text: 'Annuler', style: 'cancel' },
                            {
                              text: 'Supprimer',
                              style: 'destructive',
                              onPress: async () => {
                                await deletePlannedVisit(placeId);
                              },
                            },
                          ]
                        );
                      }}
                    >
                      <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.librarySection}>
          <View style={styles.libraryHeader}>
            <Text style={styles.libraryKicker}>Mes photos</Text>
            <Pressable style={styles.addButton} onPress={handleAddMemory}>
              <Ionicons name="add" size={18} color={COLORS.text} />
              <Text style={styles.addButtonText}>Ajouter</Text>
            </Pressable>
          </View>
          <Text style={styles.libraryTitle}>Bibliotheque{'\n'}de souvenirs</Text>

          <Text style={styles.libraryDescription}>
            Joignez plusieurs photos a votre carnet. La localisation exacte de la prise de vue est automatiquement enregistree.
          </Text>

          {memories.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="images-outline" size={40} color={COLORS.border} />
              <Text style={styles.emptyTitle}>Aucun souvenir pour l'instant</Text>
              <Text style={styles.emptySubtitle}>
                Appuyez sur "Ajouter" pour capturer votre premier souvenir avec sa localisation.
              </Text>
            </View>
          ) : (
            <View style={styles.memoryList}>
              <Text style={styles.memoryCount}>
                {memories.length} souvenir{memories.length > 1 ? 's' : ''}
              </Text>
              {memories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} onDelete={deleteMemory} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
    gap: 18,
  },
  librarySection: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    gap: 14,
  },
  libraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  libraryKicker: {
    color: COLORS.secondary,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 1.2,
    fontSize: 11,
    flex: 1,
  },
  libraryTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
  },
  libraryDescription: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
  },
  addButtonText: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 10,
  },
  emptyTitle: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  emptySubtitle: {
    color: COLORS.textSoftDark,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  memoryList: {
    gap: 10,
  },
  memoryCount: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  reservationsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    gap: 14,
  },
  reservationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reservationsKicker: {
    color: COLORS.primary,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 1.2,
    fontSize: 11,
    flex: 1,
  },
  reservationsTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
  },
  reservationsList: {
    gap: 10,
  },
  reservationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  reservationInfo: {
    flex: 1,
    gap: 6,
  },
  reservationPlace: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  reservationDateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reservationDate: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  deleteReservationButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 125, 125, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 125, 125, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
