import { FALLBACK_PLACES } from '../data/fallbackPlaces';
import { EventItem, ParisEventRecord, ParisEventsResponse, Place } from '../types/place';

const EVENTS_API_URL =
  'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=60&order_by=date_start';

function toAddress(record: ParisEventRecord) {
  return [record.address_street, record.address_zipcode, record.address_city]
    .filter(Boolean)
    .join(', ');
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

async function fetchParisEventRecords() {
  const response = await fetch(EVENTS_API_URL);

  if (!response.ok) {
    throw new Error(`Paris Data responded with ${response.status}.`);
  }

  const data = (await response.json()) as ParisEventsResponse;
  return data.results ?? [];
}

export async function fetchParisPlaces(): Promise<Place[]> {
  try {
    const records = await fetchParisEventRecords();
    const places = dedupePlaces(
      records
        .map((record, index) => toPlace(record, index))
        .filter((place): place is Place => place !== null)
    ).slice(0, 30);

    return places.length > 0 ? places : FALLBACK_PLACES;
  } catch (error) {
    console.warn('Unable to load cultural places from Paris Data.', error);
    return FALLBACK_PLACES;
  }
}

export async function fetchParisEvents(): Promise<EventItem[]> {
  try {
    const records = await fetchParisEventRecords();
    return records
      .map((record, index) => toEvent(record, index))
      .filter((event): event is EventItem => event !== null)
      .slice(0, 30);
  } catch (error) {
    console.warn('Unable to load cultural events from Paris Data.', error);
    return [];
  }
}
