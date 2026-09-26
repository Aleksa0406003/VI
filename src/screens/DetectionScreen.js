import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import { getModel } from '../ml/loadModel';
import { preprocessImage } from '../ml/preprocess';
import { parseYoloOutput } from '../ml/yoloPostprocess';
import DetectionOverlay, { DetectionLabel } from '../components/DetectionOverlay';
import ResultCard from '../components/ResultCard';
import { colors, radius, spacing, shadow, typography } from '../theme/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DISPLAY_SIZE = SCREEN_WIDTH - spacing.md * 2;

export default function DetectionScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [imageDims, setImageDims] = useState({ width: 0, height: 0 });
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runDetection = useCallback(async (uri) => {
    setLoading(true);
    setDetections([]);
    setHasSearched(false);

    try {
      const { inputTensor, originalWidth, originalHeight } =
        await preprocessImage(uri);

      setImageDims({ width: originalWidth, height: originalHeight });

      const model = await getModel();

      // react-native-fast-tflite@1.6.1: runSync prima niz TypedArray-eva
      // i vraća niz TypedArray-eva (već čitljivih, bez dodatnog "wrap-a").
      const rawOutput = model.runSync([inputTensor]);

      const results = parseYoloOutput(
        [rawOutput[0]],
        originalWidth,
        originalHeight,
      );

      setDetections(results);
      setHasSearched(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Greška', `Nešto nije uspelo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const pickFromGallery = useCallback(() => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets?.[0]?.uri;
      if (uri) {
        setImageUri(uri);
        runDetection(uri);
      }
    });
  }, [runDetection]);

  const takePhoto = useCallback(() => {
    launchCamera(
      { mediaType: 'photo', quality: 1, saveToPhotos: false },
      (response) => {
        if (response.didCancel || response.errorCode) return;
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setImageUri(uri);
          runDetection(uri);
        }
      },
    );
  }, [runDetection]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🐝</Text>
        <Text style={styles.title}>Queen Bee Detector</Text>
        <Text style={styles.subtitle}>
          Uslikaj košnicu ili izaberi sliku iz galerije da model pronađe i
          označi maticu.
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={takePhoto}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonEmoji}>📷</Text>
          <Text style={styles.buttonText}>Uslikaj</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={pickFromGallery}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonEmoji}>🖼️</Text>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Iz galerije
          </Text>
        </TouchableOpacity>
      </View>

      {!imageUri && !loading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>🍯</Text>
          <Text style={styles.emptyStateText}>
            Ovde će se prikazati slika sa označenom maticom
          </Text>
        </View>
      )}

      {loading && (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Model analizira sliku…</Text>
        </View>
      )}

      {imageUri && !loading && (
        <>
          <View
            style={[
              styles.imageContainer,
              { width: DISPLAY_SIZE, height: DISPLAY_SIZE },
            ]}
          >
            <Image
              source={{ uri: imageUri }}
              style={{ width: DISPLAY_SIZE, height: DISPLAY_SIZE }}
              resizeMode="contain"
            />
            {imageDims.width > 0 && (
              <>
                <DetectionOverlay
                  detections={detections}
                  displayWidth={DISPLAY_SIZE}
                  displayHeight={DISPLAY_SIZE}
                  originalWidth={imageDims.width}
                  originalHeight={imageDims.height}
                />
                {detections.map((box, i) => (
                  <DetectionLabel
                    key={i}
                    box={box}
                    displayWidth={DISPLAY_SIZE}
                    displayHeight={DISPLAY_SIZE}
                    originalWidth={imageDims.width}
                    originalHeight={imageDims.height}
                  />
                ))}
              </>
            )}
          </View>

          {hasSearched && (
            <View style={styles.resultSection}>
              <Text style={styles.sectionLabel}>Rezultat</Text>
              <ResultCard
                detections={detections}
                imageWidth={imageDims.width}
                imageHeight={imageDims.height}
              />
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  headerEmoji: {
    fontSize: 36,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title,
    fontSize: 22,
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.md,
    width: '100%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.pill,
    gap: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    ...shadow.button,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  buttonEmoji: {
    fontSize: 18,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButtonText: {
    color: colors.primaryDark,
  },
  emptyState: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyStateEmoji: {
    fontSize: 44,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    ...typography.subtitle,
    textAlign: 'center',
  },
  loadingCard: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  imageContainer: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  resultSection: {
    width: '100%',
    marginTop: spacing.md,
  },
  sectionLabel: {
    ...typography.sectionLabel,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
});
