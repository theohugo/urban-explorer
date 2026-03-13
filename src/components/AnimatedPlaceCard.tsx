import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
        <View style={styles.imageWrap}>
          <Image source={{ uri: place.imageUrl }} style={styles.image} />
          <View style={styles.imageOverlay} />
          <View style={styles.imageTopRow}>
            <Text style={styles.kicker}>Lieu culturel</Text>
            {plannedDate ? <Text style={styles.badge}>Visite {plannedDate.date} a {plannedDate.time}</Text> : null}
          </View>
        </View>

        <LinearGradient
          colors={['#12324A', '#0A1828']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.body}
        >
          <Text style={styles.title}>{place.name}</Text>
          <Text style={styles.address}>{place.address}</Text>

          <View style={styles.footer}>
            <View style={styles.coordinatesRow}>
              <Ionicons name="location-outline" size={14} color={COLORS.secondary} />
              <Text style={styles.coordinates}>
                {place.latitude.toFixed(3)}, {place.longitude.toFixed(3)}
              </Text>
            </View>

            <View style={styles.button}>
              <Text style={styles.buttonText}>Voir plus</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.text} />
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18,
  },
  card: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 9,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 186,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 19, 31, 0.24)',
  },
  imageTopRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  body: {
    padding: 18,
    gap: 10,
  },
  kicker: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: 'rgba(7, 19, 31, 0.72)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  badge: {
    color: COLORS.text,
    backgroundColor: 'rgba(255, 122, 89, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
  },
  address: {
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  coordinatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  coordinates: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  button: {
    backgroundColor: 'rgba(244, 201, 93, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(244, 201, 93, 0.28)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: '800',
  },
});
