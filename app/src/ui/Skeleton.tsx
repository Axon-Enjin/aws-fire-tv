import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { DisplayState, Joint, Pose } from '@formvision/core';
import { colors } from './theme';

const BONES: ReadonlyArray<readonly [Joint, Joint]> = [
  ['leftShoulder', 'rightShoulder'],
  ['leftShoulder', 'leftElbow'],
  ['leftElbow', 'leftWrist'],
  ['rightShoulder', 'rightElbow'],
  ['rightElbow', 'rightWrist'],
  ['leftShoulder', 'leftHip'],
  ['rightShoulder', 'rightHip'],
  ['leftHip', 'rightHip'],
  ['leftHip', 'leftKnee'],
  ['leftKnee', 'leftAnkle'],
  ['rightHip', 'rightKnee'],
  ['rightKnee', 'rightAnkle'],
];

/** Bones a plank hip fault is about; they take the fault style (BRANDING §4). */
const HIP_FAULT_BONES: Record<string, true> = {
  'leftShoulder-leftHip': true,
  'rightShoulder-rightHip': true,
  'leftHip-leftKnee': true,
  'rightHip-rightKnee': true,
};

type Props = {
  pose: Pose;
  /** Source frame size; the preview letterboxes it into the container (FIT_CENTER). */
  frameW: number;
  frameH: number;
  width: number;
  height: number;
  mirrored: boolean;
  display: DisplayState;
};

/** Skeleton drawn with plain Views so it has no graphics-library dependency. */
export function Skeleton({ pose, frameW, frameH, width, height, mirrored, display }: Props) {
  if (frameW === 0 || frameH === 0 || width === 0) return null;
  const scale = Math.min(width / frameW, height / frameH);
  const offX = (width - frameW * scale) / 2;
  const offY = (height - frameH * scale) / 2;
  const toScreen = (j: Joint) => {
    const p = pose[j];
    const nx = mirrored ? 1 - p.x : p.x;
    return { x: offX + nx * frameW * scale, y: offY + p.y * frameH * scale, stale: p.stale };
  };
  const fault = display === 'HIP_SAG' || display === 'HIP_PIKE';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {BONES.map(([a, b]) => {
        const pa = toScreen(a);
        const pb = toScreen(b);
        if (pose[a].lastSeen === -Infinity || pose[b].lastSeen === -Infinity) return null;
        const key = `${a}-${b}`;
        const unknown = display === 'UNKNOWN' || pa.stale || pb.stale;
        const isFault = fault && HIP_FAULT_BONES[key] === true;
        const thickness = isFault ? 10 : unknown ? 4 : 6;
        const color = isFault ? colors.fault : unknown ? colors.muted : colors.good;
        const len = Math.hypot(pb.x - pa.x, pb.y - pa.y);
        const angle = Math.atan2(pb.y - pa.y, pb.x - pa.x);
        return (
          <View
            key={key}
            style={{
              position: 'absolute',
              left: (pa.x + pb.x) / 2 - len / 2,
              top: (pa.y + pb.y) / 2 - thickness / 2,
              width: len,
              height: thickness,
              borderRadius: thickness / 2,
              transform: [{ rotate: `${angle}rad` }],
              ...(unknown && !isFault
                ? { borderTopWidth: thickness, borderColor: color, borderStyle: 'dashed', opacity: 0.8 }
                : { backgroundColor: color }),
            }}
          />
        );
      })}
      {fault &&
        (['leftHip', 'rightHip'] as const).map(j => {
          const p = toScreen(j);
          if (p.stale) return null;
          return (
            <Text key={j} style={[styles.marker, { left: p.x - 14, top: p.y - 52 }]}>
              ▲
            </Text>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  marker: { position: 'absolute', color: colors.fault, fontSize: 28, fontWeight: '700' },
});
