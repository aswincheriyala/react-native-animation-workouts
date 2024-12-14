import React, {useMemo, useState, useCallback} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {
  Blur,
  Canvas,
  Circle,
  ColorMatrix,
  Group,
  interpolateColors,
  Paint,
  RoundedRect,
} from '@shopify/react-native-skia';
import Animated, {
  measure,
  runOnJS,
  runOnUI,
  useAnimatedProps,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {Text} from 'react-native';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
Animated.addWhitelistedNativeProps({text: true});

const DEFAULT_SPRING_CONFIG = {
  stiffness: 1000,
  damping: 500,
  mass: 2,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const SkiaSlider = ({
  size = 50,
  initialValue = 0,
  blurRadius = 10,
  moveOffset = 1.1, // value between 0 and 1
  color,
  trackColor,
  animateColors,
  onValueChange,
  label,
}) => {
  const initialYPos = size / 2 + size * moveOffset;
  const sliderX = useSharedValue(0);
  const sliderY = useSharedValue(initialYPos);
  const progress = useSharedValue(initialValue);
  const sliderRef = useAnimatedRef();
  const [sliderWidth, setSliderWidth] = useState(0);

  const handleLayout = useCallback(() => {
    runOnUI(() => {
      'worklet';
      const dimensions = measure(sliderRef);
      if (dimensions) {
        runOnJS(setSliderWidth)(dimensions.width);
        sliderX.value =
          (dimensions.width / 100) * initialValue +
          ((50 - initialValue) * size) / 100;
      }
    })();
  }, [sliderRef, initialValue, sliderX, size]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(event => {
          sliderY.value = withSpring(
            initialYPos - size * moveOffset,
            DEFAULT_SPRING_CONFIG,
          );
          sliderX.value = withSpring(
            Math.min(
              sliderWidth - size / 2,
              Math.max(size / 2, event.absoluteX - size / 2),
            ),
            DEFAULT_SPRING_CONFIG,
          );
        })
        .onChange(event => {
          sliderX.value = withSpring(
            Math.min(
              sliderWidth - size / 2,
              Math.max(size / 2, event.absoluteX - size / 2),
            ),
            DEFAULT_SPRING_CONFIG,
          );
        })
        .onFinalize(() => {
          sliderY.value = withSpring(initialYPos, DEFAULT_SPRING_CONFIG);
        }),
    [sliderX, sliderY, sliderWidth, size, moveOffset, initialYPos],
  );

  useDerivedValue(() => {
    const newValue = Math.round(
      (100 * (sliderX.value - size / 2)) / (sliderWidth - size),
    );
    progress.value = newValue;
    if (onValueChange) {
      runOnJS(onValueChange)(newValue);
    }
  });

  const animatedThumbStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: -size / 2,
    left: -size / 2,
    width: size,
    height: size,
    transform: [{translateX: sliderX.value}, {translateY: sliderY.value}],
    padding: 6,
  }));

  const animatedTextProps = useAnimatedProps(() => ({
    text: progress.value.toString(),
  }));

  const layerEffect = useMemo(
    () => (
      <Paint>
        <Blur blur={blurRadius} />
        <ColorMatrix
          matrix={[
            1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 20, -10,
          ]}
        />
      </Paint>
    ),
    [blurRadius],
  );

  const _color = useDerivedValue(() => {
    if (animateColors?.length) {
      return interpolateColors(
        (progress.value / 100) * (animateColors.length - 1),
        animateColors.map((_, i) => i),
        animateColors,
      );
    }
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.sliderContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={{height: size + size * moveOffset}}
            ref={sliderRef}
            onLayout={handleLayout}>
            <Canvas style={styles.flex}>
              <Group layer={layerEffect}>
                <RoundedRect
                  x={0}
                  y={size * moveOffset}
                  r={size}
                  width={sliderWidth}
                  height={size}
                  color={animateColors?.length ? _color : color}
                />
                <Circle
                  cx={sliderX}
                  cy={sliderY}
                  r={size / 2}
                  color={animateColors?.length ? _color : trackColor || color}
                />
              </Group>
            </Canvas>
            <Animated.View style={animatedThumbStyle} pointerEvents={'none'}>
              <View style={styles.thumb}>
                <AnimatedTextInput
                  style={styles.thumbText}
                  defaultValue={initialValue.toString()}
                  editable={false}
                  animatedProps={animatedTextProps}
                />
              </View>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
        <Text>{label}</Text>
      </View>
    </GestureHandlerRootView>
  );
};

function SkiaSliderReanimated() {
  return (
    <View style={styles.flex}>
      <SkiaSlider label="<SkiaSlider />" />
      <SkiaSlider moveOffset={0.5} label="<SkiaSlider moveOffset={0.5} />" />
      <SkiaSlider
        color="blue"
        trackColor="darkblue"
        label='<SkiaSlider color="blue" trackColor="darkblue" />'
      />
      <SkiaSlider
        animateColors={['red', 'green', 'blue']}
        label='<SkiaSlider animateColors={["red", "green", "blue"]} />'
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  sliderContainer: {
    paddingHorizontal: 20,
  },
  flex: {
    flex: 1,
  },
  thumb: {
    flex: 1,
    borderRadius: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    padding: 0,
  },
});

export default SkiaSliderReanimated;
