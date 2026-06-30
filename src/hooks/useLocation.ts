import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

// 1. Definimos la estructura que tendrá la ubicación
interface LocationCoords {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export function useLocation() {
  // 2. Le decimos a useState que puede ser de tipo LocationCoords o null
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      // TypeScript ahora sabrá exactamente qué hay dentro de currentLocation.coords
      setLocation(currentLocation.coords);
      setLoading(false);
    })();
  }, []);

  return { location, errorMsg, loading };
}