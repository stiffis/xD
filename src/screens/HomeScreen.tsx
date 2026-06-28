import React from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import type { RootStackParamList } from '../navigation/navigationRef';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<Nav>();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.navbar}>
                <Text style={styles.navLogo}>KINETICA</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.navLogout}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Traducir Señas</Text>
                    <Text style={styles.cardDesc}>
                        Usa la cámara para capturar señas y traducirlas al español en tiempo real.
                    </Text>
                    <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Camera')}>
                        <Text style={styles.btnPrimaryText}>Abrir Cámara</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Texto a Señas</Text>
                    <Text style={styles.cardDesc}>
                        Escribe texto en español y obtén su representación en lenguaje de señas.
                    </Text>
                    <TouchableOpacity style={[styles.btnPrimary, styles.btnSecondary]}>
                        <Text style={styles.btnPrimaryText}>Próximamente</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f4ffff' },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 14,
        shadowColor: '#004aad',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    navLogo: {
        fontSize: 24,
        fontWeight: '900',
        color: '#004aad',
        letterSpacing: 3,
    },
    navLogout: {
        color: '#004aad',
        fontWeight: '600',
        fontSize: 14,
    },
    content: {
        padding: 20,
        gap: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#004aad',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#004aad',
        marginBottom: 8,
    },
    cardDesc: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        marginBottom: 16,
    },
    btnPrimary: {
        backgroundColor: '#004aad',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    btnSecondary: {
        backgroundColor: '#8e8e8e',
    },
    btnPrimaryText: { color: '#f4ffff', fontWeight: '700', fontSize: 15 },
});
