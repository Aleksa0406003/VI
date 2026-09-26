import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadow, typography } from '../theme/theme';
import { describeLocation } from '../utils/locationDescription';

export default function ResultCard({ detections, imageWidth, imageHeight }) {
  if (!detections?.length) {
    return (
      <View style={[styles.card, styles.emptyCard]}>
        <Text style={styles.emptyEmoji}>🔍</Text>
        <Text style={styles.emptyText}>
          Matica nije pronađena na ovoj slici. Probaj sa bližim ili jasnijim
          kadrom.
        </Text>
      </View>
    );
  }

  const best = detections[0];
  const location = describeLocation(best, imageWidth, imageHeight);
  const confidencePct = Math.round(best.score * 100);

  return (
    <View style={[styles.card, shadow.card]}>
      <View style={styles.row}>
        <View style={styles.confidenceBlock}>
          <Text style={typography.confidenceBig}>{confidencePct}%</Text>
          <Text style={typography.subtitle}>pouzdanost</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.locationBlock}>
          <Text style={styles.locationLabel}>Lokacija na slici</Text>
          <Text style={styles.locationValue}>{location}</Text>
        </View>
      </View>

      {detections.length > 1 && (
        <Text style={styles.extraNote}>
          + još {detections.length - 1}{' '}
          {detections.length - 1 === 1 ? 'moguća detekcija' : 'mogućih detekcija'}
          {' '}sa nižom pouzdanošću
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  emptyText: {
    ...typography.subtitle,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceBlock: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  locationBlock: {
    flex: 1,
  },
  locationLabel: {
    ...typography.sectionLabel,
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  extraNote: {
    ...typography.subtitle,
    marginTop: spacing.sm,
  },
});
