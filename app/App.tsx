import React, { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SessionScreen } from './src/screens/SessionScreen';
import { colors } from './src/ui/theme';

type Status = { kind: 'checking' } | { kind: 'ready' } | { kind: 'error'; message: string };

export default function App() {
  const [status, setStatus] = useState<Status>({ kind: 'checking' });
  const onError = useCallback((message: string) => setStatus({ kind: 'error', message }), []);

  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(result =>
      setStatus(
        result === PermissionsAndroid.RESULTS.GRANTED
          ? { kind: 'ready' }
          : { kind: 'error', message: 'DENIED: Camera permission was not granted.' },
      ),
    );
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      {status.kind === 'ready' && <SessionScreen onError={onError} />}
      {status.kind === 'checking' && <Text style={styles.msg}>Starting camera…</Text>}
      {status.kind === 'error' && <Text style={styles.msg}>Camera problem — {status.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink, justifyContent: 'center' },
  msg: { color: colors.text, fontSize: 20, textAlign: 'center' },
});
