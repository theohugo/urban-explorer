import { RouteProp, useRoute } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { usePlaces } from '../context/PlacesContext';
import { COLORS } from '../theme/colors';
import { DiscoveryStackParamList } from '../types/navigation';

type PlaceDetailRoute = RouteProp<DiscoveryStackParamList, 'PlaceDetail'>;

export function PlaceDetailScreen() {
  const route = useRoute<PlaceDetailRoute>();
  const { place } = route.params;
  const { plannedVisits, planVisit } = usePlaces();

  const selectedDate = plannedVisits[place.id];

  async function onDayPress(day: DateData) {
    await planVisit(place.id, day.dateString);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Image source={{ uri: place.imageUrl }} style={styles.image} />

      <View style={styles.panel}>
        <Text style={styles.eyebrow}>Destination culturelle</Text>
        <Text style={styles.title}>{place.name}</Text>
        <Text style={styles.address}>{place.address}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Latitude</Text>
            <Text style={styles.statValue}>{place.latitude.toFixed(4)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Longitude</Text>
            <Text style={styles.statValue}>{place.longitude.toFixed(4)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Planifier la visite</Text>
        <Text style={styles.sectionText}>
          Choisissez une date pour reserver mentalement votre prochaine sortie.
        </Text>

        <Calendar
          onDayPress={onDayPress}
          markedDates={
            selectedDate
              ? {
                  [selectedDate]: {
                    selected: true,
                    selectedColor: COLORS.primary,
                  },
                }
              : undefined
          }
          theme={{
            backgroundColor: COLORS.cardSoft,
            calendarBackground: COLORS.cardSoft,
            dayTextColor: COLORS.textDark,
            textSectionTitleColor: COLORS.textSoftDark,
            monthTextColor: COLORS.textDark,
            arrowColor: COLORS.primary,
            todayTextColor: COLORS.secondary,
          }}
          style={styles.calendar}
        />

        <View style={styles.confirmationCard}>
          <Text style={styles.confirmationTitle}>Confirmation</Text>
          <Text style={styles.confirmationText}>
            {selectedDate
              ? `Visite au ${place.name} planifiee le ${selectedDate}.`
              : `Aucune date definie pour ${place.name} pour le moment.`}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 36,
  },
  image: {
    width: '100%',
    height: 280,
  },
  panel: {
    marginTop: -26,
    backgroundColor: COLORS.cardSoft,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 22,
    gap: 14,
  },
  eyebrow: {
    color: COLORS.primary,
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  title: {
    color: COLORS.textDark,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 36,
  },
  address: {
    color: COLORS.textSoftDark,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 4,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF1E6',
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  statLabel: {
    color: COLORS.textSoftDark,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statValue: {
    color: COLORS.textDark,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionTitle: {
    color: COLORS.textDark,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
  },
  sectionText: {
    color: COLORS.textSoftDark,
    lineHeight: 22,
  },
  calendar: {
    borderRadius: 20,
    paddingBottom: 8,
  },
  confirmationCard: {
    backgroundColor: '#10304C',
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  confirmationTitle: {
    color: COLORS.secondary,
    fontWeight: '800',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  confirmationText: {
    color: COLORS.text,
    lineHeight: 22,
  },
});
