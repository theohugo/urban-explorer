import { RouteProp, useRoute } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, DateData } from 'react-native-calendars';
import { TimePickerModal } from '../components/TimePickerModal';
import { usePlaces } from '../context/PlacesContext';
import { COLORS } from '../theme/colors';
import { DiscoveryStackParamList } from '../types/navigation';

type PlaceDetailRoute = RouteProp<DiscoveryStackParamList, 'PlaceDetail'>;

function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function roundUpToNextQuarter(hours: number, minutes: number): string {
  let totalMinutes = hours * 60 + minutes;
  const remainder = totalMinutes % 15;

  if (remainder > 0) {
    totalMinutes += 15 - remainder;
  }

  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;

  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

export function PlaceDetailScreen() {
  const route = useRoute<PlaceDetailRoute>();
  const { place } = route.params;
  const { plannedVisits, planVisit } = usePlaces();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDateForTime, setSelectedDateForTime] = useState<string | null>(null);

  const plannedVisit = plannedVisits[place.id];
  const selectedDate = plannedVisit?.date;
  const selectedTime = plannedVisit?.time || '10:00';
  const today = useMemo(() => formatDateToString(new Date()), []);

  const minTime = useMemo(() => {
    if (selectedDateForTime === today) {
      const now = new Date();
      return roundUpToNextQuarter(now.getHours(), now.getMinutes());
    }

    return '07:00';
  }, [selectedDateForTime, today]);

  function onDayPress(day: DateData) {
    if (day.dateString < today) {
      alert('Vous ne pouvez pas reserver pour une date passee.');
      return;
    }

    setSelectedDateForTime(day.dateString);
    setShowTimePicker(true);
  }

  async function onTimeConfirm(time: string) {
    if (!selectedDateForTime) {
      return;
    }

    if (selectedDateForTime === today) {
      const [selectedHours, selectedMinutes] = time.split(':').map(Number);
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const selectedTimeInMinutes = selectedHours * 60 + selectedMinutes;
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;

      if (selectedTimeInMinutes < currentTimeInMinutes) {
        alert('Cette heure est deja passee. Choisissez une heure future.');
        return;
      }
    }

    await planVisit(place.id, selectedDateForTime, time);
    setShowTimePicker(false);
    setSelectedDateForTime(null);
  }

  function onTimeCancel() {
    setShowTimePicker(false);
    setSelectedDateForTime(null);
  }

  const disabledDates = useMemo(() => {
    const disabled: Record<string, { disabled: boolean; disableTouchEvent: boolean }> = {};
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 100);

    for (let i = 0; i < 100; i += 1) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = formatDateToString(date);
      disabled[dateStr] = { disabled: true, disableTouchEvent: true };
    }

    return disabled;
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: place.imageUrl }} style={styles.image} />

        <LinearGradient
          colors={['#12324A', '#0A1828']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.panel}
        >
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
            Choisissez une date et une heure pour reserver votre prochaine sortie.
          </Text>

          <Calendar
            onDayPress={onDayPress}
            markedDates={{
              ...disabledDates,
              ...(selectedDate
                ? {
                    [selectedDate]: {
                      selected: true,
                      selectedColor: COLORS.primary,
                    },
                  }
                : {}),
            }}
            minDate={today}
            theme={{
              backgroundColor: COLORS.surfaceStrong,
              calendarBackground: COLORS.surfaceStrong,
              dayTextColor: COLORS.text,
              textDisabledColor: 'rgba(178, 201, 217, 0.35)',
              textSectionTitleColor: COLORS.textMuted,
              monthTextColor: COLORS.text,
              arrowColor: COLORS.accent,
              todayTextColor: COLORS.secondary,
              selectedDayTextColor: COLORS.text,
            }}
            style={styles.calendar}
            disableAllTouchEventsForDisabledDays
          />

          <View style={styles.confirmationCard}>
            <Text style={styles.confirmationTitle}>Confirmation</Text>
            <Text style={styles.confirmationText}>
              {selectedDate
                ? `Visite au ${place.name} planifiee le ${selectedDate} a ${selectedTime}.`
                : `Aucune date et heure definies pour ${place.name} pour le moment.`}
            </Text>
          </View>
        </LinearGradient>
      </ScrollView>

      <TimePickerModal
        visible={showTimePicker}
        onConfirm={onTimeConfirm}
        onCancel={onTimeCancel}
        initialTime={selectedTime}
        minTime={minTime}
        maxTime="22:00"
      />
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
    paddingBottom: 36,
  },
  image: {
    width: '100%',
    height: 280,
  },
  panel: {
    marginTop: -26,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 22,
    gap: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  eyebrow: {
    color: COLORS.secondary,
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 36,
  },
  address: {
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 4,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statValue: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
  },
  sectionText: {
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  calendar: {
    borderRadius: 20,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  confirmationCard: {
    backgroundColor: 'rgba(7, 19, 31, 0.36)',
    borderRadius: 20,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
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
