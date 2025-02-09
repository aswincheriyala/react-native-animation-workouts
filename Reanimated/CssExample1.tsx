import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, { CSSStyle } from 'react-native-reanimated';
const { width, height } = Dimensions.get('window');
const BOX_SIZE = width / 2;

const animation: CSSStyle = {
  animationName: {
    '0%': {
      backgroundColor: 'red',
      left: 0,
      borderWidth: 10,
      borderRadius: BOX_SIZE,
    },
    '25%': {
      backgroundColor: 'yellow',
      left: width - BOX_SIZE,
      top: 0,
      borderRadius: 0,
    },
    '50%': {
      backgroundColor: 'blue',
      top: height / 2 - BOX_SIZE,
      borderRadius: BOX_SIZE,
      transform: [{ scale: 0 }],
      borderWidth: 0,
    },
    '75%': {
      backgroundColor: 'green',
      borderRadius: 0,
    },
    '100%': {
      backgroundColor: 'red',
      top: 0,
      borderRadius: BOX_SIZE,
      borderWidth: 10,
    },
  },
  animationDuration: '2s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-in-out',
  animationDirection: 'normal',
};

export default function App() {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
    <Animated.View
      key={i}
      style={[styles.box, animation, { animationDelay: i * 80, zIndex: 0 - i }]}
    />
  ));
}

const styles = StyleSheet.create({
  box: {
    height: BOX_SIZE,
    width: BOX_SIZE,
    position: 'absolute',
    borderColor: '#fff',
  },
});
