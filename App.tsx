import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlacesProvider } from './src/context/PlacesContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <PlacesProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </PlacesProvider>
    </SafeAreaProvider>
  );
}
