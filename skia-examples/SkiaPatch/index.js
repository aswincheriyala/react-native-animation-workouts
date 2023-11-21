import React, { useState } from 'react'
import { View, StyleSheet, StatusBar, Dimensions, Button, Text } from 'react-native'
import { Canvas, vec, Patch, Line } from "@shopify/react-native-skia";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withDelay, withRepeat, withTiming, } from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
const { height, width } = Dimensions.get('window');

const initialWidth = width / 2;
const initialHeight = width / 2;

const points = [
  vec((width - initialWidth) / 2, (height - initialHeight) / 2), // top left
  vec((width - initialWidth) / 2 + initialWidth, (height - initialHeight) / 2), // top right
  vec((width - initialWidth) / 2 + initialWidth, (height - initialHeight) / 2 + initialHeight), // bottom right
  vec((width - initialWidth) / 2, (height - initialHeight) / 2 + initialHeight), // bottom left
];
const colors = ['red', 'blue', 'green', 'yellow']

export default function SkiaPatch() {
  const [showDots, setShowDots] = useState(true);

  // initialising point positions ==== start
  const point1 = useSharedValue(points[0]);
  const point2 = useSharedValue(points[1]);
  const point3 = useSharedValue(points[2]);
  const point4 = useSharedValue(points[3]);
  // initialising point positions ==== end

  // initialising point c1 c2 positions ==== start
  const point1c1 = useSharedValue(points[0]);
  const point1c2 = useSharedValue(points[0]);

  const point2c1 = useSharedValue(points[1]);
  const point2c2 = useSharedValue(points[1]);

  const point3c1 = useSharedValue(points[2]);
  const point3c2 = useSharedValue(points[2]);

  const point4c1 = useSharedValue(points[3]);
  const point4c2 = useSharedValue(points[3]);
  // initialising point c1 c2 positions ==== end

  const patch = useDerivedValue(() => {
    const patchPoint1 = { pos: point1.value, c1: point1c1.value, c2: point1c2.value };
    const patchPoint2 = { pos: point2.value, c1: point2c1.value, c2: point2c2.value };
    const patchPoint3 = { pos: point3.value, c1: point3c1.value, c2: point3c2.value };
    const patchPoint4 = { pos: point4.value, c1: point4c1.value, c2: point4c2.value };
    return [patchPoint1, patchPoint2, patchPoint3, patchPoint4];
  });


  const reset = () => {
    point1.value = withTiming(points[0]);
    point2.value = withTiming(points[1]);
    point3.value = withTiming(points[2]);
    point4.value = withTiming(points[3]);

    point1c1.value = withTiming(points[0]);
    point1c2.value = withTiming(points[0]);
    point2c1.value = withTiming(points[1]);
    point2c2.value = withTiming(points[1]);
    point3c1.value = withTiming(points[2]);
    point3c2.value = withTiming(points[2]);
    point4c1.value = withTiming(points[3]);
    point4c2.value = withTiming(points[3]);
  }

  const random = () => {
    point1.value = withTiming(vec(Math.random() * width, Math.random() * height));
    point2.value = withTiming(vec(Math.random() * width, Math.random() * height));
    point3.value = withTiming(vec(Math.random() * width, Math.random() * height));
    point4.value = withTiming(vec(Math.random() * width, Math.random() * height));

    point1c1.value = withTiming(vec(Math.random() * width, Math.random() * height));
    point1c2.value = withTiming(vec(Math.random() * width, Math.random() * height));
    point2c1.value = withTiming(vec(Math.random() * width, Math.random() * height));
    point2c2.value = withTiming(vec(Math.random() * width, Math.random() * height));
    point3c1.value = withTiming(vec(Math.random() * width, Math.random() * height));
    point3c2.value = withTiming(vec(Math.random() * width, Math.random() * height));
    point4c1.value = withTiming(vec(Math.random() * width, Math.random() * height));
    point4c2.value = withTiming(vec(Math.random() * width, Math.random() * height));
  }

  const animateRandom = () => {
    const offset = width / 2;
    point1.value = withDelay(Math.random() * 2000, withRepeat(withTiming(vec(points[0].x + ((Math.random() - 0.5) * offset), points[0].y + ((Math.random() - 0.5) * offset)), { duration: 2000 }), -1, true));
    point1c1.value = withDelay(Math.random() * 2000, withRepeat(withTiming(vec(points[0].x + ((Math.random() - 0.5) * offset), points[0].y + ((Math.random() - 0.5) * offset)), { duration: 2000 }), -1, true));
    point1c2.value = withDelay(Math.random() * 2000, withRepeat(withTiming(vec(points[0].x + ((Math.random() - 0.5) * offset), points[0].y + ((Math.random() - 0.5) * offset)), { duration: 2000 }), -1, true));
    point2.value = withDelay(Math.random() * 2000, withRepeat(withTiming(vec(points[1].x + ((Math.random() - 0.5) * offset), points[1].y + ((Math.random() - 0.5) * offset)), { duration: 2000 }), -1, true));
    point2c1.value = withDelay(Math.random() * 2000, withRepeat(withTiming(vec(points[1].x + ((Math.random() - 0.5) * offset), points[1].y + ((Math.random() - 0.5) * offset)), { duration: 2000 }), -1, true));
    point2c2.value = withDelay(Math.random() * 2000, withRepeat(withTiming(vec(points[1].x + ((Math.random() - 0.5) * offset), points[1].y + ((Math.random() - 0.5) * offset)), { duration: 2000 }), -1, true));
    point3.value = withDelay(Math.random() * 2000, withRepeat(withTiming(vec(points[2].x + ((Math.random() - 0.5) * offset), points[2].y + ((Math.random() - 0.5) * offset)), { duration: 2000 }), -1, true));
    point3c1.value = withDelay(Math.random() * 2000, withRepeat(withTiming(vec(points[2].x + ((Math.random() - 0.5) * offset), points[2].y + ((Math.random() - 0.5) * offset)), { duration: 2000 }), -1, true));
    point3c2.value = withDelay(Math.random() * 2000, withRepeat(withTiming(vec(points[2].x + ((Math.random() - 0.5) * offset), points[2].y + ((Math.random() - 0.5) * offset)), { duration: 2000 }), -1, true));
    point4.value = withDelay(Math.random() * 2000, withRepeat(withTiming(vec(points[3].x + ((Math.random() - 0.5) * offset), points[3].y + ((Math.random() - 0.5) * offset)), { duration: 2000 }), -1, true));
    point4c1.value = withDelay(Math.random() * 2000, withRepeat(withTiming(vec(points[3].x + ((Math.random() - 0.5) * offset), points[3].y + ((Math.random() - 0.5) * offset)), { duration: 2000 }), -1, true));
    point4c2.value = withDelay(Math.random() * 2000, withRepeat(withTiming(vec(points[3].x + ((Math.random() - 0.5) * offset), points[3].y + ((Math.random() - 0.5) * offset)), { duration: 2000 }), -1, true));
  }

  const moveContainerHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.point1 = point1.value;
      ctx.point2 = point2.value;
      ctx.point3 = point3.value;
      ctx.point4 = point4.value;
      ctx.point1c1 = point1c1.value;
      ctx.point1c2 = point1c2.value;
      ctx.point2c1 = point2c1.value;
      ctx.point2c2 = point2c2.value;
      ctx.point3c1 = point3c1.value;
      ctx.point3c2 = point3c2.value;
      ctx.point4c1 = point4c1.value;
      ctx.point4c2 = point4c2.value;
    },
    onActive: (event, ctx) => {
      point1.value = vec(ctx.point1.x + event.translationX, ctx.point1.y + event.translationY)
      point2.value = vec(ctx.point2.x + event.translationX, ctx.point2.y + event.translationY)
      point3.value = vec(ctx.point3.x + event.translationX, ctx.point3.y + event.translationY)
      point4.value = vec(ctx.point4.x + event.translationX, ctx.point4.y + event.translationY)

      point1c1.value = vec(ctx.point1c1.x + event.translationX, ctx.point1c1.y + event.translationY)
      point1c2.value = vec(ctx.point1c2.x + event.translationX, ctx.point1c2.y + event.translationY)
      point2c1.value = vec(ctx.point2c1.x + event.translationX, ctx.point2c1.y + event.translationY)
      point2c2.value = vec(ctx.point2c2.x + event.translationX, ctx.point2c2.y + event.translationY)
      point3c1.value = vec(ctx.point3c1.x + event.translationX, ctx.point3c1.y + event.translationY)
      point3c2.value = vec(ctx.point3c2.x + event.translationX, ctx.point3c2.y + event.translationY)
      point4c1.value = vec(ctx.point4c1.x + event.translationX, ctx.point4c1.y + event.translationY)
      point4c2.value = vec(ctx.point4c2.x + event.translationX, ctx.point4c2.y + event.translationY)
    }
  });

  return (
    <GestureHandlerRootView style={styles.flex}>
      <StatusBar hidden />
      <Canvas style={StyleSheet.absoluteFill}>
        <Patch colors={colors} patch={patch} />

        {/* line btw dots ==== start */}
        {showDots && <>
          <Line p1={point1} p2={point1c1} color="#999" style="stroke" strokeWidth={1} />
          <Line p1={point1} p2={point1c2} color="#999" style="stroke" strokeWidth={1} />
          <Line p1={point2} p2={point2c1} color="#999" style="stroke" strokeWidth={1} />
          <Line p1={point2} p2={point2c2} color="#999" style="stroke" strokeWidth={1} />
          <Line p1={point3} p2={point3c1} color="#999" style="stroke" strokeWidth={1} />
          <Line p1={point3} p2={point3c2} color="#999" style="stroke" strokeWidth={1} />
          <Line p1={point4} p2={point4c1} color="#999" style="stroke" strokeWidth={1} />
          <Line p1={point4} p2={point4c2} color="#999" style="stroke" strokeWidth={1} />
        </>}
        {/* line btw dots ==== end */}

      </Canvas>

      <PanGestureHandler onGestureEvent={moveContainerHandler}>
        <Animated.View style={StyleSheet.absoluteFill} />
      </PanGestureHandler>

      {/* dots for changing shape ==== start */}
      {showDots && <>
        <Dot label='c2' color={'darkgreen'} position={point1c2} />
        <Dot label='c1' color={'darkred'} position={point1c1} />
        <Dot label='p' color={'#333'} position={point1} />

        <Dot label='c2' color={'darkgreen'} position={point2c2} />
        <Dot label='c1' color={'darkred'} position={point2c1} />
        <Dot label='p' color={'#333'} position={point2} />

        <Dot label='c2' color={'darkgreen'} position={point3c2} />
        <Dot label='c1' color={'darkred'} position={point3c1} />
        <Dot label='p' color={'#333'} position={point3} />

        <Dot label='c2' color={'darkgreen'} position={point4c2} />
        <Dot label='c1' color={'darkred'} position={point4c1} />
        <Dot label='p' color={'#333'} position={point4} />
      </>}
      {/* dots for changing shape ==== end */}

      <View style={{ width: '100%', flexDirection: 'row', position: 'absolute', justifyContent: 'space-evenly', bottom: 10 }}>
        <View style={styles.btn}><Button title='random animate' onPress={animateRandom} /></View>
        <View style={styles.btn}><Button title='reset' onPress={reset} /></View>
        <View style={styles.btn}><Button title='random' onPress={random} /></View>
        <View style={styles.btn}><Button title={`${showDots ? 'Hide    ' : 'Show'} dots`} onPress={() => setShowDots(val => !val)} /></View>
      </View>
    </GestureHandlerRootView>
  );
};


function Dot({ color, position, label }) {
  const style = useAnimatedStyle(() => ({
    backgroundColor: color,
    transform: [{ translateX: position.value.x }, { translateY: position.value.y }, { scale: 0.7 }],
    ...styles.dot
  }));

  const onTouchMove = (e) => {
    position.value = vec(e.nativeEvent.pageX, e.nativeEvent.pageY)
  }

  return (
    <Animated.View style={style} onTouchMove={onTouchMove}>
      <Text style={styles.txt}>{label}</Text>
    </Animated.View>
  )
}


const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff'
  },
  txt: {
    color: '#fff',
    fontSize: 22,
    transform: [{ translateY: -3 }]
  },
  dot: {
    position: 'absolute',
    height: 40,
    width: 40,
    left: -20,
    top: -20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn: {
    flex: 1,
    alignItems: 'center'
  }
})