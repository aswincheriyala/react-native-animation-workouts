import {Canvas, Line, LinearGradient, vec} from '@shopify/react-native-skia';
import React, {useEffect} from 'react';
import {StyleSheet, Dimensions, StatusBar} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  withRepeat,
  useDerivedValue,
  interpolate,
  Extrapolate,
  FadeIn,
} from 'react-native-reanimated';
const dotSize = 5;
const numberOfDots = 16;
const {height: screenHeight, width: screenWidth} = Dimensions.get('window');

const Dot = ({pos, color}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: pos.value.x}, {translateY: pos.value.y}],
      backgroundColor: color,
    };
  });
  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

function DotsLine({p1, p2, colors}) {
  const opacity = useDerivedValue(() => {
    const distance = Math.sqrt(
      (p2.value.x - p1.value.x) ** 2 + (p2.value.y - p1.value.y) ** 2,
    );
    return interpolate(
      distance,
      [0, screenWidth / 2],
      [1, 0],
      Extrapolate.CLAMP,
    );
  });
  return (
    <Line p1={p1} p2={p2} style="fill" strokeWidth={1} opacity={opacity}>
      <LinearGradient start={p1} end={p2} colors={colors} />
    </Line>
  );
}

export default function Particles() {
  const generateDot = () => ({
    pos: useSharedValue(
      vec(
        Math.random() * (screenWidth - dotSize),
        Math.random() * (screenHeight - dotSize),
      ),
    ),
    color: getRandomColor(),
    id: Math.random().toString(),
  });
  const dotsArray = Array.from({length: numberOfDots}, () => generateDot());

  useEffect(() => {
    for (let i = 0; i < dotsArray.length; i++)
      startAnimation(dotsArray[i].pos, i % 2 === 0);
  }, []);

  const getRandomDirection = isHirozontal => {
    const vertical = ['top', 'bottom'];
    const horizontal = ['left', 'right'];
    const randomIndex = Math.floor(Math.random() * 2);
    return isHirozontal ? horizontal[randomIndex] : vertical[randomIndex];
  };

  const startAnimation = (dotTranslate, isHirozontal) => {
    const direction = getRandomDirection(isHirozontal);
    const duration1 = 3000 + Math.random() * 4000;
    const duration2 = 3000 + Math.random() * 4000;
    const duration3 = 3000 + Math.random() * 4000;
    const duration4 = 3000 + Math.random() * 4000;
    switch (direction) {
      case 'left':
        dotTranslate.value = withTiming(
          vec(-dotSize, dotTranslate.value.y),
          {
            duration: duration1 * (dotTranslate.value.x / screenWidth),
            easing: Easing.linear,
          },
          () => {
            (dotTranslate.value = vec(screenWidth, dotTranslate.value.y)),
              (dotTranslate.value = withRepeat(
                withTiming(vec(-dotSize, dotTranslate.value.y), {
                  duration: duration1,
                  easing: Easing.linear,
                }),
                -1,
              ));
          },
        );
        break;
      case 'right':
        dotTranslate.value = withTiming(
          vec(screenWidth, dotTranslate.value.y),
          {
            duration:
              duration2 * ((screenWidth - dotTranslate.value.x) / screenWidth),
            easing: Easing.linear,
          },
          () => {
            dotTranslate.value = vec(-dotSize, dotTranslate.value.y);
            dotTranslate.value = withRepeat(
              withTiming(vec(screenWidth, dotTranslate.value.y), {
                duration: duration2,
                easing: Easing.linear,
              }),
              -1,
            );
          },
        );
        break;
      case 'top':
        dotTranslate.value = withTiming(
          vec(dotTranslate.value.x, -dotSize),
          {
            duration: duration3 * (dotTranslate.value.y / screenHeight),
            easing: Easing.linear,
          },
          () => {
            dotTranslate.value = vec(dotTranslate.value.x, screenHeight);
            dotTranslate.value = withRepeat(
              withTiming(vec(dotTranslate.value.x, -dotSize), {
                duration: duration3,
                easing: Easing.linear,
              }),
              -1,
            );
          },
        );
        break;
      case 'bottom':
        dotTranslate.value = withTiming(
          vec(dotTranslate.value.x, screenHeight),
          {
            duration:
              duration4 *
              ((screenHeight - dotTranslate.value.y) / screenHeight),
            easing: Easing.linear,
          },
          () => {
            dotTranslate.value = vec(dotTranslate.value.x, -dotSize);
            dotTranslate.value = withRepeat(
              withTiming(vec(dotTranslate.value.x, screenHeight), {
                duration: duration4,
                easing: Easing.linear,
              }),
              -1,
            );
          },
        );
        break;
      default:
        break;
    }
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn}>
      <StatusBar hidden />
      <Canvas style={StyleSheet.absoluteFill}>
        {dotsArray.map((dot, index) =>
          dotsArray
            .slice(index + 1)
            .map(otherDot => (
              <DotsLine
                p1={dot.pos}
                p2={otherDot.pos}
                key={`${dot.id}-${otherDot.id}`}
                colors={[dot.color, otherDot.color]}
              />
            )),
        )}
      </Canvas>
      {dotsArray.map(dot => (
        <Dot pos={dot.pos} key={dot.id} color={dot.color} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  dot: {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize,
    position: 'absolute',
    left: -dotSize / 2,
    top: -dotSize / 2,
  },
});

function getRandomColor() {
  const randomLightComponent = () => Math.floor(Math.random() * 256);
  return `rgb(${randomLightComponent()}, ${randomLightComponent()}, ${randomLightComponent()})`;
}
