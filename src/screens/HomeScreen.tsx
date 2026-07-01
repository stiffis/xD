import React, { useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
// 1. IMPORTA TU CUSTOM HOOK AQUÍ (Ajusta la ruta si es necesario)
import { useLocation } from '../hooks/useLocation'; 
import type { RootStackParamList } from '../navigation/navigationRef';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<Nav>();
    const { logout } = useAuth();
    
    // 2. CONECTAMOS EL SENSOR DE UBICACIÓN
    const { location, errorMsg } = useLocation();

    // 3. LOG AUTOMÁTICO: Saltará en la terminal apenas cargue la pantalla o cambie la ubicación
    useEffect(() => {
        if (location && location.latitude) {
            console.log("📍 ¡Ubicación capturada con éxito en HomeScreen!", location);
        }
        if (errorMsg) {
            console.log("❌ Error de GPS en HomeScreen:", errorMsg);
        }
    }, [location, errorMsg]);

    const handleLogout = async () => {
        await logout();
    };

    // 4. FUNCIÓN PARA MANDAR A TU BACKEND AL PRESIONAR EL BOTÓN DE LA CÁMARA
    const handleAbrirCamara = () => {
        if (location) {
            console.log("🚀 Coordenadas listas para enviar antes de abrir cámara:", location.latitude, location.longitude);
            // Aquí podrás meter tu fetch() hacia la IP de tu backend en el futuro
        } else if (errorMsg) {
            Alert.alert("Aviso de GPS", `No pudimos obtener tu ubicación: ${errorMsg}`);
        }
        
        // Sigue navegando normalmente a la cámara
        navigation.navigate('Camera');
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
                {/* Opcional: Una pequeña barra de estado discreta para que veas si el GPS cargó */}
                {location && (
                    <Text style={styles.gpsStatus}>📍 GPS Conectado</Text>
                )}

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Traducir Señas</Text>
                    <Text style={styles.cardDesc}>
                        Usa la cámara para capturar señas y traducirlas al español en tiempo real.
                    </Text>
                    {/* Cambiamos el onPress para procesar/revisar la ubicación antes de ir a la cámara */}
                    <TouchableOpacity style={styles.btnPrimary} onPress={handleAbrirCamara}>
                        <Text style={styles.btnPrimaryText}>Abrir Cámara</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Texto a Señas</Text>
                    <Text style={styles.cardDesc}>
                        Escribe texto en español y obtén su representación en lenguaje de señas.
                    </Text>
                    <TouchableOpacity  style={[styles.btnPrimary, styles.btnSecondary]} onPress={() => navigation.navigate('ModelScreen')}>
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
    gpsStatus: {
        fontSize: 12,
        color: '#004aad',
        fontWeight: '600',
        textAlign: 'right',
        marginBottom: -8,
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