import { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Place, PlannedVisitData } from '../types/place';
import { COLORS } from '../theme/colors';

interface AnimatedPlaceCardProps {
  place: Place;
  index: number;
  onPress: () => void;
  plannedDate?: PlannedVisitData;
}

export function AnimatedPlaceCard({ place, index, onPress, plannedDate }: AnimatedPlaceCardProps) {
  const translateY = useRef(new Animated.Value(18)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 420,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View style={[styles.wrapper, { opacity, transform: [{ translateY }] }]}>
      <Pressable style={styles.card} onPress={onPress}>
        <Image source={{ uri: place.imageUrl }} style={styles.image} />
        <View style={styles.body}>
          <View style={styles.kickerRow}>
            <Text style={styles.kicker}>Lieu culturel</Text>
            {plannedDate ? <Text style={styles.badge}>Visite {plannedDate.date} à {plannedDate.time}</Text> : null}
          </View>
          <Text style={styles.title}>{place.name}</Text>
          <Text style={styles.address}>{place.address}</Text>
          <View style={styles.footer}>
            <Text style={styles.coordinates}>
              {place.latitude.toFixed(3)}, {place.longitude.toFixed(3)}
            </Text>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Voir plus</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 9,
  },
  image: {
    width: '100%',
    height: 186,
  },
  body: {
    padding: 18,
    gap: 10,
  },
  kickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badge: {
    color: COLORS.textDark,
    backgroundColor: '#FFE2D8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: COLORS.textDark,
    fontSize: 22,
    fontWeight: '800',
  },
  address: {
    color: COLORS.textSoftDark,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  coordinates: {
    color: COLORS.textSoftDark,
    fontSize: 12,
    fontWeight: '700',
  },
  button: {
    backgroundColor: COLORS.textDark,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: '800',
  },
});
