import React from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

export default function SplashScreen({ statusText }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icon.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.title}>Queen Bee Detector</Text>
      <ActivityIndicator
        size="large"
        color={colors.primaryDark}
        style={styles.spinner}
      />
      <Text style={styles.status}>{statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.lg,
  },
  spinner: {
    marginBottom: spacing.sm,
  },
  status: {
    ...typography.subtitle,
  },
});
