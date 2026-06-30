import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import { useLocation } from '../hooks/useLocation';

export default function MapScreen() {
  const { location, errorMsg, loading } = useLocation();

  useEffect(() => {
    if (location && location.latitude) {
      console.log("📍 ¡Ubicación obtenida con éxito!", location);
    }
  }, [location]);

  const enviarUbicacionAlBackend = async () => {
    if (!location) return;

    try {
      const response = await fetch('https://tu-backend.com/api/ubicacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          userId: "123" // El ID del usuario actual
        }),
      });
      
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
    } catch (error) {
      console.error('Error al enviar al backend:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : (
        <View>
          <Text style={styles.text}>Latitud: {location?.latitude}</Text>
          <Text style={styles.text}>Longitud: {location?.longitude}</Text>
          <Button title="Enviar a Backend" onPress={enviarUbicacionAlBackend} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, marginBottom: 10 },
  error: { color: 'red', fontSize: 16 }
});