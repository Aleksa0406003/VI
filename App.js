import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import DetectionScreen from './src/screens/DetectionScreen';
import SplashScreen from './src/screens/SplashScreen';
import { getModel } from './src/ml/loadModel';
import { colors } from './src/theme/theme';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [statusText, setStatusText] = useState('Učitavanje modela…');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await getModel();
      } catch (error) {
        console.warn('Preload modela nije uspeo:', error);
        if (!cancelled) {
          setStatusText('Priprema aplikacije…');
        }
      } finally {
        setTimeout(() => {
          if (!cancelled) setIsReady(true);
        }, 400);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {isReady ? (
        <DetectionScreen />
      ) : (
        <SplashScreen statusText={statusText} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
