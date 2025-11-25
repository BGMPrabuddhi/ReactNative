import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppSelector } from '../redux/hooks';
import { Exercise } from '../types';
import { COLORS, DIFFICULTY_COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants';
import { Card, Badge } from '../components';

interface ExerciseDetailsScreenProps {
  route: any;
  navigation: any;
}

const ExerciseDetailsScreen: React.FC<ExerciseDetailsScreenProps> = ({ route, navigation }) => {
  const { exercise }: { exercise: Exercise } = route.params;
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 25,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const difficultyColor = DIFFICULTY_COLORS[exercise.difficulty as keyof typeof DIFFICULTY_COLORS] || colors.textSecondary;

  const getMuscleIcon = (muscle: string): keyof typeof Feather.glyphMap => {
    const iconMap: { [key: string]: keyof typeof Feather.glyphMap } = {
      abdominals: 'crosshair',
      biceps: 'zap',
      chest: 'heart',
      forearms: 'minus',
      glutes: 'circle',
      hamstrings: 'trending-up',
      lats: 'maximize-2',
      quadriceps: 'triangle',
      shoulders: 'wind',
      triceps: 'chevrons-down',
    };
    return iconMap[muscle.toLowerCase()] || 'activity';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Enhanced Header */}
      <View style={[styles.header, { backgroundColor: colors.card }, SHADOWS.sm]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, { backgroundColor: colors.background }]}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Exercise Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <Animated.View 
          style={[
            styles.titleSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>{exercise.name}</Text>

          <View style={styles.badges}>
            <Badge
              text={exercise.difficulty.toUpperCase()}
              color={difficultyColor}
              icon="trending-up"
              size="medium"
            />
            <Badge
              text={exercise.muscle.toUpperCase()}
              color={colors.secondary}
              icon="target"
              size="medium"
            />
            <Badge
              text={exercise.type.toUpperCase()}
              color={colors.info}
              icon="cpu"
              size="medium"
            />
          </View>
        </Animated.View>

        {/* Info Card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Card isDarkMode={isDarkMode} style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Feather name="cpu" size={24} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Type</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconContainer, { backgroundColor: colors.secondary + '15' }]}>
                <Feather name="tool" size={24} color={colors.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Equipment</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {exercise.equipment.replace('_', ' ').charAt(0).toUpperCase() +
                    exercise.equipment.replace('_', ' ').slice(1)}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconContainer, { backgroundColor: difficultyColor + '15' }]}>
                <Feather name="bar-chart-2" size={24} color={difficultyColor} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Difficulty Level</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Instructions Card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Card isDarkMode={isDarkMode} style={styles.instructionsCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Feather name="list" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Instructions</Text>
            </View>
            <Text style={[styles.instructions, { color: colors.text }]}>
              {exercise.instructions}
            </Text>
          </Card>
        </Animated.View>

        {/* Tips Card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Card isDarkMode={isDarkMode} style={[styles.tipsCard, { backgroundColor: colors.warning + '10', borderColor: colors.warning + '40' }]}>
            <View style={styles.tipsHeader}>
              <View style={[styles.tipsIconContainer, { backgroundColor: colors.warning + '20' }]}>
                <Feather name="alert-circle" size={24} color={colors.warning} />
              </View>
              <Text style={[styles.tipsTitle, { color: colors.text }]}>Safety Tips</Text>
            </View>
            <Text style={[styles.tipsText, { color: colors.text }]}>
              • Always warm up before exercising{'\n'}
              • Maintain proper form throughout{'\n'}
              • Listen to your body and stop if you feel pain{'\n'}
              • Stay hydrated during workout{'\n'}
              • Cool down and stretch after exercise
            </Text>
          </Card>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: 50,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    marginTop: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.lg,
    lineHeight: FONTS.sizes.xxxl * FONTS.lineHeights.tight,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  infoCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.semibold,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.xs,
  },
  instructionsCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
  },
  instructions: {
    fontSize: FONTS.sizes.md,
    lineHeight: FONTS.sizes.md * FONTS.lineHeights.relaxed,
  },
  tipsCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.massive,
    borderWidth: 1,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  tipsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  tipsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  tipsText: {
    fontSize: FONTS.sizes.md,
    lineHeight: FONTS.sizes.md * FONTS.lineHeights.relaxed,
  },
});

export default ExerciseDetailsScreen;
