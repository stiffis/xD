import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';

interface AnimationSpeedSliderProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export default function AnimationSpeedSlider({ speed, onSpeedChange }: AnimationSpeedSliderProps) {
  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0.5}
        maximumValue={2.0}
        step={0.1}
        value={speed}
        onValueChange={onSpeedChange}
        minimumTrackTintColor="#ec4899" // accent-pink-500
        maximumTrackTintColor="#4b5563" // bg-gray-600
        thumbTintColor="#ec4899"
      />
      <TouchableOpacity onPress={() => onSpeedChange(1)} style={styles.resetButton}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.8)', // bg-[#1e293b]/80
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  slider: {
    width: 200,
    height: 40,
  },
  resetButton: {
    marginTop: 4,
  },
  resetText: {
    fontSize: 12,
    color: '#9ca3af', // text-gray-400
  },
});