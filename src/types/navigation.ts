import { Place } from './place';

export type DiscoveryStackParamList = {
  DiscoveryHome: undefined;
  PlaceDetail: { place: Place };
};

export type RootTabParamList = {
  DecouverteTab: undefined;
  Evenements: undefined;
  Carte: undefined;
  Profil: undefined;
};
