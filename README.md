# KINETICA Mobile

App móvil de KINETICA para traducción de lenguaje de señas a español y viceversa.  
Construida con Expo 56 + React Native + TypeScript.

## Requisitos

- Node.js 18+
- npm
- [Expo Go](https://expo.dev/go) instalado en tu celular **o** un emulador Android/iOS

## Instalación

```bash
git clone git@github.com:stiffis/xD.git
cd xD
npm install
```

## Configurar la URL del backend

Abre `src/api/axios.ts` y ajusta `BASE_URL` según tu entorno:

| Entorno | URL |
|---|---|
| Emulador Android | `http://10.0.2.2:8080/api/v1` (default) |
| Emulador iOS / simulador | `http://localhost:8080/api/v1` |
| Dispositivo físico | `http://<IP-de-tu-PC>:8080/api/v1` |

> Para encontrar tu IP local: `ip a` (Linux) / `ipconfig` (Windows) / `ifconfig` (Mac).  
> El backend debe estar corriendo en el puerto 8080.

## Correr la app

```bash
# Menú interactivo (escanea el QR con Expo Go)
npm start

# Directo en emulador Android
npm run android

# Directo en simulador iOS (solo macOS)
npm run ios
```

Cuando aparezca el QR en la terminal, escanearlo con la cámara del celular (iOS) o con la app Expo Go (Android).

## Estructura del proyecto

```
src/
├── api/
│   └── axios.ts           # Cliente HTTP con interceptor de refresh token
├── context/
│   ├── AuthContext.ts     # Definición del contexto de autenticación
│   └── AuthProvider.tsx   # Estado global de sesión (AsyncStorage)
├── hooks/
│   └── useAuth.ts         # Hook para consumir el contexto de auth
├── navigation/
│   ├── AppNavigator.tsx   # Stack dinámico: auth o app según sesión
│   └── navigationRef.ts   # Referencia global para redirigir desde axios
├── screens/
│   ├── LoginScreen.tsx    # Pantalla de inicio de sesión
│   ├── RegisterScreen.tsx # Pantalla de registro
│   ├── HomeScreen.tsx     # Pantalla principal con opciones de traducción
│   └── CameraScreen.tsx   # Cámara para capturar señas
├── services/
│   └── AuthService.ts     # Llamadas a /auth/login y /auth/register
└── types/
    └── type.ts            # Tipos compartidos (AuthResponse, Credentials, etc.)
```

## Flujo de la app

1. Si no hay sesión → Login/Register
2. Login/Register exitoso → Home
3. Home → botón "Abrir Cámara" → CameraScreen para traducir señas
4. Cerrar Sesión → revoca el refresh token en el backend y vuelve al Login

## Notas de desarrollo

- **Tokens**: se guardan en `AsyncStorage` (equivalente al `localStorage` del web).
- **Refresh automático**: si el access token expira, el interceptor pide uno nuevo automáticamente. Si el refresh también falla, redirige al login.
- **Cámara**: usa `expo-camera` con la cámara frontal. La integración con el endpoint de traducción del backend (`POST /api/v1/translations`) está preparada en `CameraScreen.tsx` con un `TODO` comentado.
- **Diseño**: mismos colores que el frontend web (`#004aad`, `#f4ffff`) y fuente Rubik.
