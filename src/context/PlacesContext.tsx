import { PropsWithChildren, createContext, startTransition, useContext, useEffect, useMemo, useState } from 'react';
import { fetchParisEvents, fetchParisPlaces } from '../services/parisApi';
import { loadPlannedVisits, loadProfilePhoto, savePlannedVisits, saveProfilePhoto } from '../services/storage';
import { EventItem, PlannedVisits, Place } from '../types/place';

interface PlacesContextValue {
  places: Place[];
  events: EventItem[];
  isLoading: boolean;
  error: string | null;
  plannedVisits: PlannedVisits;
  profilePhotoUri: string | null;
  refreshData: () => Promise<void>;
  planVisit: (placeId: string, date: string) => Promise<void>;
  setProfilePhoto: (uri: string | null) => Promise<void>;
}

const PlacesContext = createContext<PlacesContextValue | null>(null);

export function PlacesProvider({ children }: PropsWithChildren) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plannedVisits, setPlannedVisits] = useState<PlannedVisits>({});
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);

  useEffect(() => {
    void refreshData();
    void hydrateStorage();
  }, []);

  async function hydrateStorage() {
    const [storedVisits, storedPhoto] = await Promise.all([loadPlannedVisits(), loadProfilePhoto()]);

    startTransition(() => {
      setPlannedVisits(storedVisits);
      setProfilePhotoUri(storedPhoto);
    });
  }

  async function refreshData() {
    setIsLoading(true);
    setError(null);

    try {
      const [nextPlaces, nextEvents] = await Promise.all([fetchParisPlaces(), fetchParisEvents()]);

      startTransition(() => {
        setPlaces(nextPlaces);
        setEvents(nextEvents);
      });
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Une erreur inconnue est survenue.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function planVisit(placeId: string, date: string) {
    const nextVisits = {
      ...plannedVisits,
      [placeId]: date,
    };

    setPlannedVisits(nextVisits);
    await savePlannedVisits(nextVisits);
  }

  async function setProfilePhoto(uri: string | null) {
    setProfilePhotoUri(uri);
    await saveProfilePhoto(uri);
  }

  const value = useMemo(
    () => ({
      places,
      events,
      isLoading,
      error,
      plannedVisits,
      profilePhotoUri,
      refreshData,
      planVisit,
      setProfilePhoto,
    }),
    [error, events, isLoading, places, plannedVisits, profilePhotoUri]
  );

  return <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>;
}

export function usePlaces() {
  const context = useContext(PlacesContext);

  if (!context) {
    throw new Error('usePlaces must be used within PlacesProvider');
  }

  return context;
}
