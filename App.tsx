import { StatusBar } from 'expo-status-bar';
import { useFonts, Rubik_400Regular, Rubik_600SemiBold, Rubik_700Bold } from '@expo-google-fonts/rubik';
import { ActivityIndicator, View } from 'react-native';
import AuthProvider from './src/context/AuthProvider';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
    const [fontsLoaded] = useFonts({ Rubik_400Regular, Rubik_600SemiBold, Rubik_700Bold });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4ffff' }}>
                <ActivityIndicator size="large" color="#004aad" />
            </View>
        );
    }

    return (
        <AuthProvider>
            <StatusBar style="light" backgroundColor="#004aad" />
            <AppNavigator />
        </AuthProvider>
    );
}
