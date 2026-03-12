import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { HeroHeader } from '../components/HeroHeader';
import { ProfilePhotoCard } from '../components/ProfilePhotoCard';
import { usePlaces } from '../context/PlacesContext';
import { COLORS } from '../theme/colors';

export function ProfileScreen() {
  const { profilePhotoUri, setProfilePhoto } = usePlaces();

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
      await setProfilePhoto(result.assets[0].uri);
    }
  }

  async function handleClearPhoto() {
    await setProfilePhoto(null);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
      <HeroHeader
        title="Votre carnet de souvenirs"
        subtitle="Conservez un portrait local dans l'application et retrouvez vos preparatifs de visite."
      />

      <ProfilePhotoCard imageUri={profilePhotoUri} onTakePhoto={handleTakePhoto} onClear={handleClearPhoto} />

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Fonctionnalites livrees</Text>
        <Text style={styles.infoText}>Photo de profil locale, dates de visite sauvegardees et camera integree.</Text>
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
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    padding: 20,
    gap: 8,
  },
  infoTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
  infoText: {
    color: COLORS.textMuted,
    lineHeight: 22,
  },
});
