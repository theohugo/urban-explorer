import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DiscoveryScreen } from '../screens/DiscoveryScreen';
import { EventsScreen } from '../screens/EventsScreen';
import { MapScreen } from '../screens/MapScreen';
import { PlaceDetailScreen } from '../screens/PlaceDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { COLORS } from '../theme/colors';
import { DiscoveryStackParamList, RootTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<DiscoveryStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    card: COLORS.backgroundSecondary,
    text: COLORS.text,
    border: COLORS.border,
    primary: COLORS.primary,
  },
};

function DiscoveryStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        contentStyle: { backgroundColor: COLORS.background },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="DiscoveryHome"
        component={DiscoveryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlaceDetail"
        component={PlaceDetailScreen}
        options={{
          title: 'Detail du lieu',
          headerBackTitle: 'Retour',
        }}
      />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.backgroundSecondary,
            borderTopColor: COLORS.borderSoft,
            height: 72,
            paddingTop: 8,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
          },
          tabBarIcon: ({ color, size }) => {
            const iconName =
              route.name === 'DecouverteTab'
                ? 'sparkles-outline'
                : route.name === 'Evenements'
                  ? 'calendar-outline'
                : route.name === 'Carte'
                  ? 'map-outline'
                  : 'camera-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="DecouverteTab"
          component={DiscoveryStackNavigator}
          options={{ title: 'Decouverte' }}
        />
        <Tab.Screen name="Evenements" component={EventsScreen} options={{ title: 'Evenements' }} />
        <Tab.Screen name="Carte" component={MapScreen} />
        <Tab.Screen name="Profil" component={ProfileScreen} options={{ title: 'Mon Profil' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
