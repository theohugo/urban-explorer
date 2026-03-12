import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Pressable } from 'react-native';
import { MemoryCard } from '../components/MemoryCard';
import { HeroHeader } from '../components/HeroHeader';
import { ProfilePhotoCard } from '../components/ProfilePhotoCard';
import { usePlaces } from '../context/PlacesContext';
import { Memory } from '../types/place';
import { COLORS } from '../theme/colors';

export function ProfileScreen() {
  const { profilePhotoUri, setProfilePhoto, memories, addMemory, deleteMemory } = usePlaces();

  async function handleTakePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission refusée', "L'application a besoin de la caméra pour prendre un selfie.");
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
      const parts = [
        place?.name,
        place?.street,
        place?.postalCode,
        place?.city,
      ].filter(Boolean);

      const address = parts.length > 0 ? parts.join(', ') : `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;

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
      Alert.alert('Permission refusée', "L'application a besoin de la caméra.");
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
      Alert.alert('Permission refusée', "L'application a besoin d'accéder à votre galerie.");
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
        subtitle="Capturez vos moments préférés avec leur localisation exacte et conservez-les dans votre bibliothèque personnelle."
      />

      <ProfilePhotoCard imageUri={profilePhotoUri} onTakePhoto={handleTakePhoto} onClear={handleClearPhoto} />

      {/* Bibliothèque de souvenirs */}
      <View style={styles.librarySection}>
        <View style={styles.libraryHeader}>
          <Text style={styles.libraryKicker}>Mes photos</Text>
          <Pressable style={styles.addButton} onPress={handleAddMemory}>
            <Ionicons name="add" size={18} color={COLORS.text} />
            <Text style={styles.addButtonText}>Ajouter</Text>
          </Pressable>
        </View>
        <Text style={styles.libraryTitle}>Bibliothèque{'\n'}de souvenirs</Text>

        <Text style={styles.libraryDescription}>
          Joignez plusieurs photos à votre carnet. La localisation exacte de la prise de vue est automatiquement enregistrée.
        </Text>

        {memories.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={40} color={COLORS.border} />
            <Text style={styles.emptyTitle}>Aucun souvenir pour l'instant</Text>
            <Text style={styles.emptySubtitle}>
              Appuyez sur « Ajouter » pour capturer votre premier souvenir avec sa localisation.
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
});
