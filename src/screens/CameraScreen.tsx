import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/navigationRef';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

export default function CameraScreen() {
    const navigation = useNavigation<Nav>();
    const [permission, requestPermission] = useCameraPermissions();
    const [translating, setTranslating] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null);

    if (!permission) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#004aad" />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.root}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backBtn}>← Volver</Text>
                    </TouchableOpacity>
                    <Text style={styles.navTitle}>Cámara</Text>
                    <View style={{ width: 60 }} />
                </View>
                <View style={styles.centered}>
                    <Text style={styles.permText}>Se necesita acceso a la cámara para traducir señas.</Text>
                    <TouchableOpacity style={styles.btnPrimary} onPress={requestPermission}>
                        <Text style={styles.btnPrimaryText}>Dar Permiso</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const handleCapture = async () => {
        if (!cameraRef.current || translating) return;
        setTranslating(true);
        setResult(null);
        try {
            // TODO: capturar frame y enviar al backend para traducción
            // const photo = await cameraRef.current.takePictureAsync({ base64: true });
            // const res = await api.post('/translations', { ... });
            setResult('Traducción en desarrollo...');
        } catch {
            setResult('Error al traducir. Intenta de nuevo.');
        } finally {
            setTranslating(false);
        }
    };

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.navTitle}>Traducir Seña</Text>
                <View style={{ width: 60 }} />
            </View>

            <CameraView ref={cameraRef} style={styles.camera} facing="front">
                <View style={styles.overlay}>
                    <View style={styles.frame} />
                </View>
            </CameraView>

            <View style={styles.controls}>
                {result && (
                    <View style={styles.resultBox}>
                        <Text style={styles.resultLabel}>Traducción:</Text>
                        <Text style={styles.resultText}>{result}</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} disabled={translating}>
                    {translating
                        ? <ActivityIndicator color="#f4ffff" />
                        : <Text style={styles.captureBtnText}>Traducir</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#000' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4ffff', padding: 24 },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#004aad',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    backBtn: { color: '#f4ffff', fontSize: 15, fontWeight: '600' },
    navTitle: { color: '#f4ffff', fontSize: 18, fontWeight: '700' },
    camera: { flex: 1 },
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    frame: {
        width: 260,
        height: 260,
        borderWidth: 3,
        borderColor: '#f4ffff',
        borderRadius: 20,
        opacity: 0.7,
    },
    controls: {
        backgroundColor: '#ffffff',
        padding: 20,
        gap: 12,
    },
    resultBox: {
        backgroundColor: '#f4ffff',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#004aad',
    },
    resultLabel: { color: '#004aad', fontWeight: '700', fontSize: 13, marginBottom: 4 },
    resultText: { color: '#1a1a1a', fontSize: 16 },
    captureBtn: {
        backgroundColor: '#004aad',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    captureBtnText: { color: '#f4ffff', fontWeight: '700', fontSize: 16 },
    permText: { color: '#004aad', fontSize: 15, textAlign: 'center', marginBottom: 20 },
    btnPrimary: {
        backgroundColor: '#004aad',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 32,
        alignItems: 'center',
    },
    btnPrimaryText: { color: '#f4ffff', fontWeight: '700', fontSize: 15 },
});
