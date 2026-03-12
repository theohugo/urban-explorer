export interface ParisPlaceRecord {
  recordid?: string;
  nom_usuel?: string;
  adresse?: string;
  coordonnees_geo?: {
    lat?: number;
    lon?: number;
  };
}

export interface ParisPlacesResponse {
  results?: ParisPlaceRecord[];
}

export interface ParisEventRecord {
  id?: string;
  title?: string;
  lead_text?: string | null;
  cover_url?: string | null;
  address_name?: string | null;
  address_street?: string | null;
  address_zipcode?: string | null;
  address_city?: string | null;
  date_start?: string | null;
  date_end?: string | null;
  date_description?: string | null;
  url?: string | null;
  access_link?: string | null;
  access_link_text?: string | null;
  price_type?: string | null;
  price_detail?: string | null;
  group?: string | null;
  audience?: string | null;
  qfap_tags?: string | null;
  lat_lon?: {
    lat?: number;
    lon?: number;
  } | null;
}

export interface ParisEventsResponse {
  results?: ParisEventRecord[];
}

export interface Place {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
}

export interface EventItem {
  id: string;
  title: string;
  summary: string;
  venueName: string;
  address: string;
  latitude: number;
  longitude: number;
  startDate: string | null;
  endDate: string | null;
  dateLabel: string;
  imageUrl: string;
  category: string;
  audience: string;
  priceLabel: string;
  detailsUrl: string | null;
}

export interface PlannedVisits {
  [placeId: string]: string;
}
