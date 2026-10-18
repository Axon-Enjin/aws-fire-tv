import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  CoachMachine,
  CuePolicy,
  type DisplayState,
  type PlankReading,
  PlankClassifier,
  type Pose,
  PoseSmoother,
  SessionStats,
} from '@formvision/core';
import { CameraPreview, LIVE_MODEL, livePoseSource } from '../pose/native';
import { Skeleton } from '../ui/Skeleton';
import { colors, type } from '../ui/theme';
import { CAMERA_CONTENT_ROTATION_DEG } from '../config';

const MAX_FPS = 30;
const CUE_TEXT: Record<'HIP_SAG' | 'HIP_PIKE', string> = {
  HIP_SAG: 'Hips up a little — squeeze your glutes.',
  HIP_PIKE: 'Lower your hips into a straight line.',
};

type SessionView = {
  pose: Pose;
  w: number;
  h: number;
  reading: PlankReading;
  display: DisplayState;
  fps: number;
  inferMs: number;
};

/** Live plank session (SITEMAP S-05): preview + skeleton on the left, coaching column on the right. */
export function SessionScreen({ onError }: { onError: (message: string) => void }) {
  const pipeline = useMemo(
    () => ({
      smoother: new PoseSmoother(LIVE_MODEL),
      classifier: new PlankClassifier(),
      machine: new CoachMachine(),
      cues: new CuePolicy(),
      stats: new SessionStats(),
    }),
    [],
  );
  const [view, setView] = useState<SessionView | null>(null);
  const [cue, setCue] = useState<string | null>(null);
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const frameTimes = useRef<number[]>([]);

  useEffect(() => {
    const offPose = livePoseSource.onPose(frame => {
      const { smoother, classifier, machine, cues, stats } = pipeline;
      const pose = smoother.update(frame);
      const reading = classifier.update(pose, frame.t, frame.w, frame.h);
      const events = machine.update(reading, frame.t);
      stats.update(machine.displayState, events, frame.t, false);
      for (const e of events) {
        if (e.type === 'FaultConfirmed' && cues.allow(e.fault, e.severityDeg, e.t)) setCue(CUE_TEXT[e.fault]);
        if (e.type === 'FixConfirmed') setCue("That's it. Hold right there.");
        if (e.type === 'TrackingLost') setCue('Step back so I can see all of you.');
      }
      const times = frameTimes.current;
      times.push(frame.t);
      while (times.length > 0 && frame.t - times[0]! > 1000) times.shift();
      setView({
        pose,
        w: frame.w,
        h: frame.h,
        reading,
        display: machine.displayState,
        fps: times.length,
        inferMs: frame.inferMs,
      });
    });
    const offError = livePoseSource.onError(err => onError(`${err.code}: ${err.message}`));
    livePoseSource.start('0', MAX_FPS, CAMERA_CONTENT_ROTATION_DEG).catch((e: Error) => onError(e.message));
    return () => {
      offPose();
      offError();
      livePoseSource.stop();
    };
  }, [pipeline, onError]);

  const summary = pipeline.stats.summary();
  const f = view?.reading.features;
  const stateLabel = view?.display ?? 'UNKNOWN';

  return (
    <View style={styles.root}>
      <View
        style={styles.feed}
        onLayout={e => setLayout({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
      >
        <CameraPreview style={StyleSheet.absoluteFill} mirrored />
        {view && (
          <Skeleton
            pose={view.pose}
            frameW={view.w}
            frameH={view.h}
            width={layout.width}
            height={layout.height}
            mirrored
            display={view.display}
          />
        )}
        <Text style={styles.hud}>
          {view
            ? `${view.fps} fps · infer ${view.inferMs} ms · ${view.reading.state}` +
              (f ? ` · line ${f.bodyLineDeg.toFixed(0)}° · tilt ${f.torsoTiltDeg.toFixed(0)}° · ${f.side}` : ' · tracking lost')
            : 'Starting camera…'}
        </Text>
      </View>
      <View style={styles.side}>
        <Text style={styles.title}>Plank</Text>
        <Text style={styles.timer}>{formatTime(summary.heldSec)}</Text>
        <Text style={styles.meta}>held · {summary.goodPct}% good form</Text>
        <View style={[styles.badge, { borderColor: badgeColor(stateLabel) }]}>
          <Text style={[styles.badgeText, { color: badgeColor(stateLabel) }]}>{STATE_TEXT[stateLabel]}</Text>
        </View>
        {cue && <Text style={styles.cue}>“{cue}”</Text>}
      </View>
    </View>
  );
}

const STATE_TEXT: Record<DisplayState, string> = {
  GOOD: 'Good form',
  HIP_SAG: '▲ Hips sagging',
  HIP_PIKE: '▲ Hips too high',
  UNKNOWN: 'Not tracking',
};

function badgeColor(s: DisplayState) {
  return s === 'GOOD' ? colors.good : s === 'UNKNOWN' ? colors.warn : colors.fault;
}

function formatTime(sec: number) {
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
}

// Sizes are dp: a 1080p TV is 960×540 dp, so BRANDING px sizes are halved here.
const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: colors.ink, paddingHorizontal: 48, paddingVertical: 27 },
  feed: { flex: 6, backgroundColor: '#000', borderRadius: 8, overflow: 'hidden' },
  hud: { position: 'absolute', left: 8, bottom: 8, color: colors.text, fontSize: 12, backgroundColor: '#000a', padding: 4 },
  side: { flex: 4, paddingLeft: 24, justifyContent: 'center' },
  title: { color: colors.text, fontSize: type.h1.fontSize / 2, fontWeight: type.h1.fontWeight },
  timer: { color: colors.text, fontSize: type.display.fontSize / 2, fontWeight: type.display.fontWeight, fontVariant: ['tabular-nums'] },
  meta: { color: colors.muted, fontSize: type.caption.fontSize / 2 + 2 },
  badge: { marginTop: 16, alignSelf: 'flex-start', borderWidth: 2, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { fontSize: type.body.fontSize / 2, fontWeight: '600' },
  cue: { marginTop: 16, color: colors.text, fontSize: type.h2.fontSize / 2, fontWeight: type.h2.fontWeight },
});
