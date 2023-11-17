import React, { useRef, useState } from 'react';
import { Canvas, Mask, Group, Rect, RoundedRect, Text, matchFont } from '@shopify/react-native-skia';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { Button, Dimensions, StyleSheet, View, Image, StatusBar } from 'react-native';

const { height, width } = Dimensions.get('window');

const fontStyle = {
  fontSize: 15,
};
const font = matchFont(fontStyle);

const SkiaAppWalkThrough = ({ positions, overlayColor, hintTextColor }) => {
  const active = useRef(0);
  const [show, setShow] = useState(true);
  const [secondButtonText, setSecondButtonText] = useState(
    active.current === positions.length - 1 ? 'Continue' : 'Next',
  );
  const buttonOpacity = useSharedValue(1)
  const hintText = useSharedValue(positions[active.current].hintText);
  const boxHeight = useSharedValue(positions[active.current].height);
  const boxWidth = useSharedValue(positions[active.current].width);
  const x = useSharedValue(positions[active.current].x);
  const y = useSharedValue(positions[active.current].y);
  const radius = useSharedValue(positions[active.current].radius);
  const textX = useSharedValue(positions[active.current].textYTransform);
  const newTextY =
    positions[active.current].height + positions[active.current].y >
      (height * 2) / 3
      ? positions[active.current].y - fontStyle.fontSize - 10
      : positions[active.current].height +
      positions[active.current].y +
      fontStyle.fontSize +
      10;
  const textY = useSharedValue(newTextY);

  const animate = isNext => {
    if (isNext && active.current === positions.length - 1) {
      // if we click on continue, animate and remove the view.
      boxHeight.value = withSpring(height, { mass: 0.1 });
      boxWidth.value = withSpring(width, { mass: 0.1 });
      x.value = withSpring(0, { mass: 0.1 });
      y.value = withSpring(0, { mass: 0.1 });
      radius.value = withSpring(0, { mass: 0.1 })
      buttonOpacity.value = 0;
      setTimeout(() => {
        setShow(false)
      }, 200)
      return;
    }
    
    if (isNext)
      active.current =
        active.current === positions.length - 1
          ? active.current
          : active.current + 1;
    else
      active.current =
        active.current === 0 ? active.current : active.current - 1;

    hintText.value = positions[active.current].hintText;
    boxHeight.value = withSpring(positions[active.current].height, { mass: 0.3 });
    boxWidth.value = withSpring(positions[active.current].width, { mass: 0.3 });
    x.value = withSpring(positions[active.current].x, { mass: 0.5 });
    y.value = withSpring(positions[active.current].y, { mass: 0.5 });
    radius.value = withSpring(positions[active.current].radius, { mass: 0.3 });
    textX.value = withSpring(positions[active.current].textYTransform, {
      mass: 0.8,
    });
    const newTextY =
      positions[active.current].height + positions[active.current].y >
        (height * 2) / 3
        ? positions[active.current].y - fontStyle.fontSize - 10
        : positions[active.current].height +
        positions[active.current].y +
        fontStyle.fontSize +
        10;
    textY.value = withSpring(newTextY, { mass: 0.5 });
    setTimeout(() => {
      setSecondButtonText(
        active.current === positions.length - 1 ? 'Continue' : 'Next',
      );
    }, 0);
  };

  if (!show) {
    return null;
  }
  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Mask
          mode="luminance"
          mask={
            <Group>
              <Rect x={0} y={0} width={width} height={height} color="white" />
              <RoundedRect x={x} y={y} r={radius} height={boxHeight} width={boxWidth} color="black" />
            </Group>
          }>
          <Rect x={0} y={0} width={width} height={height} color={overlayColor} />
          <Text text={hintText} y={textY} x={textX} color={hintTextColor} font={font} />
        </Mask>
      </Canvas>
      <View style={styles.flex} />
      <Animated.View style={{ ...styles.btnContainer, opacity: buttonOpacity }}>
        <Button title="prev" onPress={() => { animate(false) }} />
        <Button title={secondButtonText} onPress={() => { animate(true) }} />
      </Animated.View>
    </View>
  );
};

export default function App() {
  // ******* NOTE *******
  // this positions wont work on all screens. 
  // try to make x, y, height, width values generic using screen height/width (eg :-  {x: width/2, y: height/2})

  const positions = [
    { x: 0, y: 0, height: 56, width: 70, radius: 25, hintText: 'Update your profile.', textYTransform: 20 },
    { x: 295, y: 5, height: 45, width: 45, radius: 25, hintText: 'Check your notifications here.', textYTransform: 120 },
    { x: 20, y: 235, height: 110, width: 260, radius: 20, hintText: 'Transfer money.', textYTransform: 25 },
    { x: 290, y: 235, height: 110, width: 70, radius: 20, hintText: 'Check balance.', textYTransform: 250 },
    { x: 0, y: 470, height: 80, width: 133, radius: 0, hintText: 'Setup phonePe wallet.', textYTransform: 10 },
    { x: 2, y: 610, height: 120, width: 378, radius: 10, hintText: 'Pay your bills.', textYTransform: 50 },
    { x: 65, y: 5, height: 50, width: 140, radius: 0, hintText: 'Update address here.', textYTransform: 50 },
  ];
  return (
    <View style={styles.flex}>
      {/* your whole app */}
      <StatusBar backgroundColor={'#53228c'} />
      <Image source={require('./ux.jpeg')} style={styles.full} resizeMode="cover" />
      {/* your whole app */}

      <SkiaAppWalkThrough overlayColor="#000000ef" positions={positions} hintTextColor={'#ddd'} />

    </View>
  );
}


const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  full: { height: '100%', width: '100%' },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
  }
})