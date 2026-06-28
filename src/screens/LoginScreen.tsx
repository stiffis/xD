import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { login } from '../services/AuthService';
import type { RootStackParamList } from '../navigation/navigationRef';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
    const navigation = useNavigation<Nav>();
    const { login: authLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError('');
        if (!email || !password) {
            setError('Todos los campos son obligatorios');
            return;
        }
        setLoading(true);
        try {
            const res = await login({ email, password });
            await authLogin(res);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
            setError(axiosErr.response?.data?.message ?? axiosErr.response?.data?.error ?? 'Credenciales incorrectas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.logo}>KINETICA</Text>
                    <Text style={styles.subtitle}>Hola, Bienvenido!</Text>
                </View>

                <View style={styles.card}>
                    <TextInput
                        style={styles.input}
                        placeholder="Correo Electrónico"
                        placeholderTextColor="#8e8e8e"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <View style={styles.passwordWrapper}>
                        <TextInput
                            style={[styles.input, { flex: 1, borderWidth: 0 }]}
                            placeholder="Contraseña"
                            placeholderTextColor="#8e8e8e"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                            <Text style={styles.eyeText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                        </TouchableOpacity>
                    </View>

                    {!!error && <Text style={styles.error}>{error}</Text>}

                    <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit} disabled={loading}>
                        {loading ? <ActivityIndicator color="#f4ffff" /> : <Text style={styles.btnPrimaryText}>Iniciar Sesión</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.btnSecondaryText}>¿No tienes cuenta? Regístrate</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f4ffff' },
    scroll: { flexGrow: 1 },
    header: {
        backgroundColor: '#004aad',
        paddingTop: 80,
        paddingBottom: 40,
        alignItems: 'center',
    },
    logo: {
        fontSize: 42,
        fontWeight: '900',
        color: '#f4ffff',
        letterSpacing: 4,
    },
    subtitle: {
        fontSize: 18,
        color: '#f4ffff',
        marginTop: 8,
        fontWeight: '500',
    },
    card: {
        margin: 20,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#004aad',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#004aad',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1a1a1a',
        marginBottom: 14,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#004aad',
        borderRadius: 12,
        marginBottom: 14,
        paddingHorizontal: 16,
    },
    eyeBtn: { paddingVertical: 14 },
    eyeText: { color: '#004aad', fontWeight: '600', fontSize: 13 },
    error: { color: '#ef4444', marginBottom: 10, fontSize: 13 },
    btnPrimary: {
        backgroundColor: '#004aad',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 4,
    },
    btnPrimaryText: { color: '#f4ffff', fontWeight: '700', fontSize: 16 },
    btnSecondary: {
        marginTop: 14,
        alignItems: 'center',
    },
    btnSecondaryText: { color: '#004aad', fontWeight: '600', fontSize: 14 },
});
