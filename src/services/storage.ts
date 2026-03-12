import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlannedVisits } from '../types/place';

const PROFILE_PHOTO_KEY = '@urban-explorer/profile-photo';
const PLANNED_VISITS_KEY = '@urban-explorer/planned-visits';

export async function loadProfilePhoto() {
  return AsyncStorage.getItem(PROFILE_PHOTO_KEY);
}

export async function saveProfilePhoto(uri: string | null) {
  if (uri) {
    await AsyncStorage.setItem(PROFILE_PHOTO_KEY, uri);
    return;
  }

  await AsyncStorage.removeItem(PROFILE_PHOTO_KEY);
}

export async function loadPlannedVisits(): Promise<PlannedVisits> {
  const raw = await AsyncStorage.getItem(PLANNED_VISITS_KEY);

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as PlannedVisits;
  } catch {
    return {};
  }
}

export async function savePlannedVisits(visits: PlannedVisits) {
  await AsyncStorage.setItem(PLANNED_VISITS_KEY, JSON.stringify(visits));
}
