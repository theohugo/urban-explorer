import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';

interface TimePickerModalProps {
  visible: boolean;
  onConfirm: (time: string) => void;
  onCancel: () => void;
  initialTime?: string;
  minTime?: string;
  maxTime?: string;
}

function timeStringToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function TimePickerModal({
  visible,
  onConfirm,
  onCancel,
  initialTime = '10:00',
  minTime,
  maxTime,
}: TimePickerModalProps) {
  const [hours, setHours] = useState<number>(parseInt(initialTime.split(':')[0], 10));
  const [minutes, setMinutes] = useState<number>(parseInt(initialTime.split(':')[1], 10));

  const minMinutes = minTime ? timeStringToMinutes(minTime) : 0;
  const maxMinutes = maxTime ? timeStringToMinutes(maxTime) : 1439;

  const hoursList = Array.from({ length: 24 }, (_, i) => i);
  const minutesList = [0, 15, 30, 45];

  const validHours = hoursList.filter((hour) => {
    const hourStartMin = hour * 60;
    const hourEndMin = (hour + 1) * 60 - 1;
    return hourStartMin <= maxMinutes && hourEndMin >= minMinutes;
  });

  const validMinutes = minutesList.filter((minute) => {
    const timeInMinutes = hours * 60 + minute;
    return timeInMinutes >= minMinutes && timeInMinutes <= maxMinutes;
  });

  if (!validHours.includes(hours) && validHours.length > 0) {
    setHours(validHours[0]);
  }

  if (
    validMinutes.length > 0 &&
    !validMinutes.includes(minutes) &&
    hours === parseInt(initialTime.split(':')[0], 10)
  ) {
    setMinutes(validMinutes[0]);
  }

  function handleConfirm() {
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    onConfirm(timeString);
  }

  function handleHourChange(hour: number) {
    setHours(hour);

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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <LinearGradient
          colors={['#12324A', '#0A1828']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <Text style={styles.title}>Choisir l'heure de visite</Text>

          {minTime && maxTime ? (
            <View style={styles.info}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.accent} />
              <Text style={styles.infoText}>Horaires du lieu : {minTime} - {maxTime}</Text>
            </View>
          ) : null}

          <View style={styles.timePickerContainer}>
            <View style={styles.column}>
              <Text style={styles.label}>Heures</Text>
              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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

            <View style={styles.column}>
              <Text style={styles.label}>Minutes</Text>
              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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

          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Heure selectionnee</Text>
            <Text style={styles.previewTime}>
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirmer</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(2, 8, 14, 0.68)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 20,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(7, 19, 31, 0.34)',
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
    textAlign: 'center',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 250,
    backgroundColor: 'rgba(7, 19, 31, 0.34)',
    borderRadius: 20,
    padding: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  timeOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
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
    fontWeight: '700',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  timeOptionTextSelected: {
    color: COLORS.text,
  },
  previewContainer: {
    backgroundColor: 'rgba(7, 19, 31, 0.34)',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  previewTime: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.accent,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
});
