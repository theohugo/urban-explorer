import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { COLORS } from '../theme/colors';

interface TimePickerModalProps {
  visible: boolean;
  onConfirm: (time: string) => void;
  onCancel: () => void;
  initialTime?: string; // Format: "14:30"
  minTime?: string;     // Format: "09:00" - heure min de l'événement
  maxTime?: string;     // Format: "18:30" - heure max de l'événement
}

function timeStringToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function TimePickerModal({
  visible,
  onConfirm,
  onCancel,
  initialTime = '10:00',
  minTime,
  maxTime,
}: TimePickerModalProps) {
  const [hours, setHours] = useState<number>(parseInt(initialTime.split(':')[0]));
  const [minutes, setMinutes] = useState<number>(parseInt(initialTime.split(':')[1]));

  // Calculs des limites min/max
  const minMinutes = minTime ? timeStringToMinutes(minTime) : 0;
  const maxMinutes = maxTime ? timeStringToMinutes(maxTime) : 1439; // 23:59

  const hoursList = Array.from({ length: 24 }, (_, i) => i);
  const minutesList = [0, 15, 30, 45];

  // Filtrer les heures valides
  const validHours = hoursList.filter((hour) => {
    const hourStartMin = hour * 60;
    const hourEndMin = (hour + 1) * 60 - 1;
    return hourStartMin <= maxMinutes && hourEndMin >= minMinutes;
  });

  // Filtrer les minutes valides pour l'heure courante
  const validMinutes = minutesList.filter((minute) => {
    const timeInMinutes = hours * 60 + minute;
    return timeInMinutes >= minMinutes && timeInMinutes <= maxMinutes;
  });

  // Si l'heure actuelle n'est pas valide, utiliser la première heure valide
  if (!validHours.includes(hours) && validHours.length > 0) {
    setHours(validHours[0]);
  }

  // Si les minutes ne sont pas valides, utiliser les premières minutes valides
  if (
    validMinutes.length > 0 &&
    !validMinutes.includes(minutes) &&
    hours === parseInt(initialTime.split(':')[0])
  ) {
    setMinutes(validMinutes[0]);
  }

  function handleConfirm() {
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    onConfirm(timeString);
  }

  function handleHourChange(hour: number) {
    setHours(hour);
    // Réinitialiser les minutes si elles ne sont plus valides
    const timeInMinutes = hour * 60 + minutes;
    const maxMinForHour = Math.min((hour + 1) * 60 - 1, maxMinutes);
    const minMinForHour = Math.max(hour * 60, minMinutes);

    if (timeInMinutes < minMinForHour || timeInMinutes > maxMinForHour) {
      const validMin = minutesList.find(
        (m) => hour * 60 + m >= minMinForHour && hour * 60 + m <= maxMinForHour
      );
      if (validMin !== undefined) {
        setMinutes(validMin);
      }
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.container}>
          <Text style={styles.title}>Choisir l'heure de visite</Text>

          {minTime && maxTime && (
            <Text style={styles.info}>
              📅 Horaires du lieu : {minTime} - {maxTime}
            </Text>
          )}

          <View style={styles.timePickerContainer}>
            {/* Heures */}
            <View style={styles.column}>
              <Text style={styles.label}>Heures</Text>
              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                {validHours.map((hour) => (
                  <Pressable
                    key={hour}
                    onPress={() => handleHourChange(hour)}
                    style={[
                      styles.timeOption,
                      hours === hour && styles.timeOptionSelected,
                      !validHours.includes(hour) && styles.timeOptionDisabled,
                    ]}
                    disabled={!validHours.includes(hour)}
                  >
                    <Text
                      style={[
                        styles.timeOptionText,
                        hours === hour && styles.timeOptionTextSelected,
                      ]}
                    >
                      {String(hour).padStart(2, '0')}h
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Minutes */}
            <View style={styles.column}>
              <Text style={styles.label}>Minutes</Text>
              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                {validMinutes.map((minute) => (
                  <Pressable
                    key={minute}
                    onPress={() => setMinutes(minute)}
                    style={[
                      styles.timeOption,
                      minutes === minute && styles.timeOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeOptionText,
                        minutes === minute && styles.timeOptionTextSelected,
                      ]}
                    >
                      {String(minute).padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Affichage de l'heure sélectionnée */}
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Heure sélectionnée :</Text>
            <Text style={styles.previewTime}>
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
            </Text>
          </View>

          {/* Boutons */}
          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirmer</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.cardSoft,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  info: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.primary,
    textAlign: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 250,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 12,
    gap: 16,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSoftDark,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  timeOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  timeOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  timeOptionDisabled: {
    opacity: 0.3,
  },
  timeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSoftDark,
    textAlign: 'center',
  },
  timeOptionTextSelected: {
    color: 'white',
    fontWeight: '700',
  },
  previewContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSoftDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewTime: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.cardSoft,
    borderWidth: 1.5,
    borderColor: COLORS.textSoftDark,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSoftDark,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
