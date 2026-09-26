import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { colors, radius } from '../theme/theme';

function toDisplayRect(box, displayWidth, displayHeight, originalWidth, originalHeight) {
  const scaleX = displayWidth / originalWidth;
  const scaleY = displayHeight / originalHeight;

  return {
    x: box.x * scaleX,
    y: box.y * scaleY,
    width: box.width * scaleX,
    height: box.height * scaleY,
  };
}

export default function DetectionOverlay({
  detections,
  displayWidth,
  displayHeight,
  originalWidth,
  originalHeight,
}) {
  if (!detections?.length || !originalWidth || !originalHeight) {
    return null;
  }

  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width={displayWidth}
      height={displayHeight}
    >
      {detections.map((box, i) => {
        const rect = toDisplayRect(
          box,
          displayWidth,
          displayHeight,
          originalWidth,
          originalHeight,
        );
        return (
          <Rect
            key={i}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            stroke={colors.boxStroke}
            strokeWidth={3}
            rx={radius.sm}
            fill="none"
          />
        );
      })}
    </Svg>
  );
}

export function DetectionLabel({
  box,
  displayWidth,
  displayHeight,
  originalWidth,
  originalHeight,
}) {
  const rect = toDisplayRect(
    box,
    displayWidth,
    displayHeight,
    originalWidth,
    originalHeight,
  );

  const top = Math.max(rect.y - 26, 2);

  return (
    <View
      style={[
        styles.label,
        { left: rect.x, top },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.labelText}>
        {box.label} · {Math.round(box.score * 100)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    backgroundColor: colors.boxStroke,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  labelText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
