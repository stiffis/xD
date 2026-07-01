import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/navigationRef';
import { sendVideoToPython } from '../services/ModelService';
import { createTranslation, pollTranslation } from '../services/translationService';
import type { TranslationResponse } from '../types/type';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

export default function CameraScreen() {
    const navigation = useNavigation<Nav>();
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
    const cameraRef = useRef<CameraView>(null);

    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedUri, setRecordedUri] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Procesando video...');
    const [sourceText, setSourceText] = useState('');
    const [finalText, setFinalText] = useState('');
    const [status, setStatus] = useState('Listo para grabar.');
    const [error, setError] = useState('');

    const isBusy = loading;

    const allPermissionsGranted =
        cameraPermission?.granted && microphonePermission?.granted;

    const handleStartCamera = () => {
        setIsCameraOn(true);
        setRecordedUri(null);
        setSourceText('');
        setFinalText('');
        setError('');
        setStatus('Camara activa.');
    };

    const handleStopCamera = () => {
        setIsCameraOn(false);
        if (isRecording) {
            setIsRecording(false);
        }
        setRecordedUri(null);
        setStatus('Camara detenida.');
    };

    const handleStartRecording = async () => {
        if (!cameraRef.current || isRecording) return;
        try {
            setError('');
            setIsRecording(true);
            setRecordedUri(null);
            setStatus('Grabando...');
            const result = await cameraRef.current.recordAsync();
            if (result?.uri) {
                setRecordedUri(result.uri);
                setStatus('Grabacion completada.');
            }
        } catch {
            setError('Error al grabar video.');
            setStatus('Error.');
        } finally {
            setIsRecording(false);
        }
    };

    const handleStopRecording = () => {
        if (!cameraRef.current || !isRecording) return;
        cameraRef.current.stopRecording();
    };

    const handleTranslate = async () => {
        if (!recordedUri || isBusy) return;

        setLoading(true);
        setError('');
        setSourceText('');
        setFinalText('');

        try {
            setLoadingMessage('Analizando senas...');
            setStatus('Enviando video al modelo...');
            const predictedText = await sendVideoToPython(recordedUri);
            setSourceText(predictedText);
            setStatus('Prediccion recibida desde el modelo.');

            if (predictedText) {
                setLoadingMessage('Generando traduccion...');
                setStatus('Enviando al backend...');
                const requestId = await createTranslation('SIGN_TO_TEXT', predictedText);
                setStatus('Backend acepto la traduccion. Consultando resultado...');
                const result: TranslationResponse = await pollTranslation(requestId);
                setFinalText(result.textOutput ?? '');
                setStatus('Traduccion completada.');
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Error en la traduccion';
            setError(msg);
            setStatus('Error.');
        } finally {
            setLoading(false);
        }
    };

    if (!cameraPermission || !microphonePermission) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#004aad" />
            </View>
        );
    }

    if (!allPermissionsGranted) {
        return (
            <SafeAreaView style={styles.root}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backBtn}>{'← Volver'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.navTitle}>Sena a texto</Text>
                    <View style={{ width: 60 }} />
                </View>
                <View style={styles.centered}>
                    <Text style={styles.permText}>
                        Se necesita acceso a la camara y microfono para grabar senas.
                    </Text>
                    {!cameraPermission?.granted && (
                        <TouchableOpacity style={styles.btnPrimary} onPress={requestCameraPermission}>
                            <Text style={styles.btnPrimaryText}>Dar permiso de camara</Text>
                        </TouchableOpacity>
                    )}
                    {cameraPermission?.granted && !microphonePermission?.granted && (
                        <TouchableOpacity
                            style={[styles.btnPrimary, { marginTop: 12 }]}
                            onPress={requestMicrophonePermission}
                        >
                            <Text style={styles.btnPrimaryText}>Dar permiso de microfono</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>{'← Volver'}</Text>
                </TouchableOpacity>
                <Text style={styles.navTitle}>Sena a texto</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
                {isCameraOn ? (
                    <View style={styles.cameraWrapper}>
                        <CameraView
                            ref={cameraRef}
                            style={styles.camera}
                            facing="front"
                            mode="video"
                        />
                    </View>
                ) : (
                    <View style={styles.cameraOff}>
                        <Text style={styles.cameraOffText}>Camara apagada</Text>
                    </View>
                )}

                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.ctrlBtn, styles.ctrlPrimary]}
                        onPress={handleStartCamera}
                        disabled={isCameraOn || isBusy}
                    >
                        <Text style={styles.ctrlBtnText}>Prender camara</Text>
                    </TouchableOpacity>

                    <View style={styles.row}>
                        <TouchableOpacity
                            style={[styles.ctrlBtn, styles.ctrlRecord, { flex: 1 }]}
                            onPress={handleStartRecording}
                            disabled={!isCameraOn || isRecording || isBusy}
                        >
                            <Text style={styles.ctrlBtnText}>Iniciar grabacion</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.ctrlBtn, styles.ctrlStop, { flex: 1 }]}
                            onPress={handleStopRecording}
                            disabled={!isRecording || isBusy}
                        >
                            <Text style={styles.ctrlBtnText}>Detener</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.row}>
                        <TouchableOpacity
                            style={[styles.ctrlBtn, styles.ctrlTranslate, { flex: 1 }]}
                            onPress={handleTranslate}
                            disabled={!recordedUri || isBusy}
                        >
                            <Text style={styles.ctrlBtnText}>
                                {isBusy ? 'Procesando...' : 'Traducir'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.ctrlBtn, styles.ctrlOff, { flex: 1 }]}
                            onPress={handleStopCamera}
                            disabled={isBusy}
                        >
                            <Text style={styles.ctrlOffText}>Apagar camara</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.statusBox}>
                    <Text style={styles.statusLabel}>Estado</Text>
                    {sourceText ? (
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Texto predicho</Text>
                            <Text style={styles.cardText}>{sourceText}</Text>
                        </View>
                    ) : null}
                    {finalText ? (
                        <View style={[styles.card, styles.finalCard]}>
                            <Text style={[styles.cardLabel, styles.finalLabel]}>Resultado final</Text>
                            <Text style={styles.finalText}>{finalText}</Text>
                        </View>
                    ) : null}
                    <Text style={styles.statusMsg}>{status}</Text>
                    {error ? <Text style={styles.errorMsg}>{error}</Text> : null}
                </View>
            </ScrollView>

            {isBusy && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#004aad" />
                    <Text style={styles.loadingText}>{loadingMessage}</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#f4ffff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4ffff',
        padding: 24,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#004aad',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    backBtn: {
        color: '#f4ffff',
        fontSize: 15,
        fontWeight: '600',
    },
    navTitle: {
        color: '#f4ffff',
        fontSize: 18,
        fontWeight: '700',
    },
    body: {
        flex: 1,
    },
    bodyContent: {
        padding: 16,
        gap: 16,
    },
    cameraWrapper: {
        overflow: 'hidden',
        borderRadius: 20,
        backgroundColor: '#000',
        height: 400,
    },
    camera: {
        flex: 1,
    },
    cameraOff: {
        height: 200,
        borderRadius: 20,
        backgroundColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraOffText: {
        color: '#8e8e8e',
        fontSize: 16,
        fontWeight: '500',
    },
    controls: {
        gap: 10,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    ctrlBtn: {
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctrlPrimary: {
        backgroundColor: '#004aad',
    },
    ctrlRecord: {
        backgroundColor: '#1a1a2e',
    },
    ctrlStop: {
        backgroundColor: '#e11d48',
    },
    ctrlTranslate: {
        backgroundColor: '#059669',
    },
    ctrlOff: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        backgroundColor: '#ffffff',
    },
    ctrlBtnText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 14,
    },
    ctrlOffText: {
        color: '#475569',
        fontWeight: '700',
        fontSize: 14,
    },
    statusBox: {
        backgroundColor: '#f1f5f9',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        gap: 10,
    },
    statusLabel: {
        color: '#004aad',
        fontWeight: '700',
        fontSize: 13,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    cardLabel: {
        color: '#64748b',
        fontWeight: '600',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 6,
    },
    cardText: {
        color: '#1a1a1a',
        fontSize: 17,
        fontWeight: '600',
    },
    finalCard: {
        backgroundColor: '#ecfdf5',
        borderColor: '#a7f3d0',
    },
    finalLabel: {
        color: '#047857',
    },
    finalText: {
        color: '#064e3b',
        fontSize: 22,
        fontWeight: '700',
    },
    statusMsg: {
        color: '#64748b',
        fontSize: 13,
    },
    errorMsg: {
        color: '#ef4444',
        fontWeight: '600',
        fontSize: 13,
    },
    permText: {
        color: '#004aad',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 20,
    },
    btnPrimary: {
        backgroundColor: '#004aad',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 32,
        alignItems: 'center',
    },
    btnPrimaryText: {
        color: '#f4ffff',
        fontWeight: '700',
        fontSize: 15,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});
