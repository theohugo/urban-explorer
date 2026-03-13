import { FALLBACK_PLACES } from '../data/fallbackPlaces';
import { httpClient } from './httpClient';
import { EventItem, ParisEventRecord, ParisEventsResponse, Place } from '../types/place';

const EVENTS_API_BASE_URL =
  'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records';
const PAGE_SIZE = 50;

function toAddress(record: ParisEventRecord) {
  return [record.address_street, record.address_zipcode, record.address_city]
    .filter(Boolean)
    .join(', ');
}

/**
 * Extrait l'heure au format HH:MM d'une date ISO
 */
function extractTimeFromISO(isoString: string | null | undefined): string | undefined {
  if (!isoString) return undefined;
  try {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return undefined;
  }
}

function toPlace(record: ParisEventRecord, index: number): Place | null {
  const latitude = record.lat_lon?.lat;
  const longitude = record.lat_lon?.lon;
  const address = toAddress(record);

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    !record.address_name ||
    !address
  ) {
    return null;
  }

  return {
    id: `place-${record.address_name}-${index}`,
    name: record.address_name,
    address,
    latitude,
    longitude,
    imageUrl: record.cover_url ?? `https://picsum.photos/seed/urban-explorer-place-${index}/600/400`,
  };
}

function toEvent(record: ParisEventRecord, index: number): EventItem | null {
  const latitude = record.lat_lon?.lat;
  const longitude = record.lat_lon?.lon;
  const address = toAddress(record);

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    !record.title ||
    !record.address_name ||
    !address
  ) {
    return null;
  }

  const startTime = extractTimeFromISO(record.date_start);
  const endTime = extractTimeFromISO(record.date_end);

  return {
    id: record.id ?? `event-${index}`,
    title: record.title,
    summary: record.lead_text ?? 'Evenement culturel a Paris.',
    venueName: record.address_name,
    address,
    latitude,
    longitude,
    startDate: record.date_start ?? null,
    endDate: record.date_end ?? null,
    startTime,
    endTime,
    dateLabel: record.date_description ?? 'Date a confirmer',
    imageUrl: record.cover_url ?? `https://picsum.photos/seed/urban-explorer-event-${index}/600/400`,
    category: record.qfap_tags ?? 'Sortie',
    audience: record.audience ?? 'Tout public',
    priceLabel: record.price_type ?? 'Consulter le detail',
    detailsUrl: record.url ?? record.access_link ?? null,
  };
}

function dedupePlaces(places: Place[]) {
  const seen = new Set<string>();

  return places.filter((place) => {
    const key = `${place.name.toLowerCase()}-${place.address.toLowerCase()}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function buildEventsUrl(offset: number, limit: number) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    order_by: 'date_start',
  });

  return `${EVENTS_API_BASE_URL}?${params.toString()}`;
}

async function fetchParisEventRecords(offset = 0, limit = PAGE_SIZE) {
  const response = await httpClient.get<ParisEventsResponse>(buildEventsUrl(offset, limit));
  const data = response.data;
  return data.results ?? [];
}

export async function fetchParisPlaces(offset = 0): Promise<Place[]> {
  try {
    const records = await fetchParisEventRecords(offset);
    const places = dedupePlaces(
      records
        .map((record, index) => toPlace(record, offset + index))
        .filter((place): place is Place => place !== null)
    );

    return offset === 0 && places.length === 0 ? FALLBACK_PLACES : places;
  } catch (error) {
    console.warn('Unable to load cultural places from Paris Data.', error);
    return offset === 0 ? FALLBACK_PLACES : [];
  }
}

export async function fetchParisEvents(offset = 0): Promise<EventItem[]> {
  try {
    const records = await fetchParisEventRecords(offset);
    return records
      .map((record, index) => toEvent(record, offset + index))
      .filter((event): event is EventItem => event !== null);
  } catch (error) {
    console.warn('Unable to load cultural events from Paris Data.', error);
    return [];
  }
}
