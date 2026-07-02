import React from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { OrbitControls } from '@react-three/drei/native';
import { Model } from '../components/Model';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{this.state.error.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function ModelScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ErrorBoundary>
        <Canvas camera={{ position: [0, 2, 10], fov: 60 }} gl={{ alpha: false }}>
          <OrbitControls makeDefault enableZoom />
          <Model />
          <mesh position={[3, 0, 0]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshBasicMaterial color="red" />
          </mesh>
        </Canvas>
      </ErrorBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#ef4444', fontSize: 14, textAlign: 'center', fontFamily: 'Rubik' },
});
