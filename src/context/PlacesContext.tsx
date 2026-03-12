import { PropsWithChildren, createContext, startTransition, useContext, useEffect, useMemo, useState } from 'react';
import { fetchParisEvents, fetchParisPlaces } from '../services/parisApi';
import { loadPlannedVisits, loadProfilePhoto, savePlannedVisits, saveProfilePhoto } from '../services/storage';
import { EventItem, PlannedVisits, Place } from '../types/place';

interface PlacesContextValue {
  places: Place[];
  events: EventItem[];
  isLoading: boolean;
  isLoadingMorePlaces: boolean;
  isLoadingMoreEvents: boolean;
  hasMorePlaces: boolean;
  hasMoreEvents: boolean;
  error: string | null;
  plannedVisits: PlannedVisits;
  profilePhotoUri: string | null;
  refreshData: () => Promise<void>;
  loadMorePlaces: () => Promise<void>;
  loadMoreEvents: () => Promise<void>;
  ensurePlacesCount: (minimumCount: number) => Promise<void>;
  planVisit: (placeId: string, date: string) => Promise<void>;
  setProfilePhoto: (uri: string | null) => Promise<void>;
}

const PlacesContext = createContext<PlacesContextValue | null>(null);

export function PlacesProvider({ children }: PropsWithChildren) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMorePlaces, setIsLoadingMorePlaces] = useState(false);
  const [isLoadingMoreEvents, setIsLoadingMoreEvents] = useState(false);
  const [hasMorePlaces, setHasMorePlaces] = useState(true);
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
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
        setHasMorePlaces(nextPlaces.length > 0);
        setHasMoreEvents(nextEvents.length > 0);
      });
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Une erreur inconnue est survenue.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadMorePlaces() {
    if (isLoading || isLoadingMorePlaces || !hasMorePlaces) {
      return;
    }

    setIsLoadingMorePlaces(true);

    try {
      const nextPlaces = await fetchParisPlaces(places.length);

      startTransition(() => {
        if (nextPlaces.length === 0) {
          setHasMorePlaces(false);
          return;
        }

        setPlaces((currentPlaces) => {
          const seen = new Set(currentPlaces.map((place) => `${place.name}-${place.address}`.toLowerCase()));
          const mergedPlaces = [...currentPlaces];

          for (const place of nextPlaces) {
            const key = `${place.name}-${place.address}`.toLowerCase();

            if (!seen.has(key)) {
              seen.add(key);
              mergedPlaces.push(place);
            }
          }

          return mergedPlaces;
        });
      });
    } finally {
      setIsLoadingMorePlaces(false);
    }
  }

  async function loadMoreEvents() {
    if (isLoading || isLoadingMoreEvents || !hasMoreEvents) {
      return;
    }

    setIsLoadingMoreEvents(true);

    try {
      const nextEvents = await fetchParisEvents(events.length);

      startTransition(() => {
        if (nextEvents.length === 0) {
          setHasMoreEvents(false);
          return;
        }

        setEvents((currentEvents) => {
          const seen = new Set(currentEvents.map((event) => event.id));
          const mergedEvents = [...currentEvents];

          for (const event of nextEvents) {
            if (!seen.has(event.id)) {
              seen.add(event.id);
              mergedEvents.push(event);
            }
          }

          return mergedEvents;
        });
      });
    } finally {
      setIsLoadingMoreEvents(false);
    }
  }

  async function ensurePlacesCount(minimumCount: number) {
    if (isLoading || isLoadingMorePlaces || !hasMorePlaces || places.length >= minimumCount) {
      return;
    }

    let currentPlaces = places;
    let currentHasMorePlaces: boolean = hasMorePlaces;

    while (currentPlaces.length < minimumCount && currentHasMorePlaces) {
      setIsLoadingMorePlaces(true);

      try {
        const nextPlaces = await fetchParisPlaces(currentPlaces.length);

        if (nextPlaces.length === 0) {
          currentHasMorePlaces = false;
          setHasMorePlaces(false);
          break;
        }

        const seen = new Set(currentPlaces.map((place) => `${place.name}-${place.address}`.toLowerCase()));
        const mergedPlaces = [...currentPlaces];

        for (const place of nextPlaces) {
          const key = `${place.name}-${place.address}`.toLowerCase();

          if (!seen.has(key)) {
            seen.add(key);
            mergedPlaces.push(place);
          }
        }

        currentPlaces = mergedPlaces;
        startTransition(() => {
          setPlaces(mergedPlaces);
        });
      } finally {
        setIsLoadingMorePlaces(false);
      }
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
      isLoadingMorePlaces,
      isLoadingMoreEvents,
      hasMorePlaces,
      hasMoreEvents,
      error,
      plannedVisits,
      profilePhotoUri,
      refreshData,
      loadMorePlaces,
      loadMoreEvents,
      ensurePlacesCount,
      planVisit,
      setProfilePhoto,
    }),
    [
      error,
      events,
      hasMoreEvents,
      hasMorePlaces,
      isLoading,
      isLoadingMoreEvents,
      isLoadingMorePlaces,
      places,
      plannedVisits,
      profilePhotoUri,
    ]
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
