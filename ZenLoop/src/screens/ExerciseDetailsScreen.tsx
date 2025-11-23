import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppSelector } from '../redux/hooks';
import { Exercise } from '../types';
import { COLORS, DIFFICULTY_COLORS } from '../constants/colors';

interface ExerciseDetailsScreenProps {
  route: any;
  navigation: any;
}

const ExerciseDetailsScreen: React.FC<ExerciseDetailsScreenProps> = ({ route, navigation }) => {
  const { exercise }: { exercise: Exercise } = route.params;
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const difficultyColor =
    DIFFICULTY_COLORS[exercise.difficulty as keyof typeof DIFFICULTY_COLORS] || colors.textSecondary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Exercise Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.heroSection, { backgroundColor: colors.primary + '20' }]}>
          <Feather name="activity" size={80} color={colors.primary} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.title, { color: colors.text }]}>{exercise.name}</Text>

          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: difficultyColor + '20' }]}>
              <Feather name="trending-up" size={16} color={difficultyColor} />
              <Text style={[styles.badgeText, { color: difficultyColor }]}>
                {exercise.difficulty.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.secondary + '20' }]}>
              <Feather name="target" size={16} color={colors.secondary} />
              <Text style={[styles.badgeText, { color: colors.secondary }]}>
                {exercise.muscle.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.infoRow}>
            <Feather name="cpu" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Type</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Feather name="tool" size={20} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Equipment</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {exercise.equipment.replace('_', ' ').charAt(0).toUpperCase() +
                  exercise.equipment.replace('_', ' ').slice(1)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="clipboard" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Instructions</Text>
          </View>
          <Text style={[styles.instructions, { color: colors.text }]}>
            {exercise.instructions}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.tipsContainer}>
            <Feather name="info" size={20} color={colors.warning} />
            <Text style={[styles.tipsText, { color: colors.textSecondary }]}>
              Remember to warm up before exercising and cool down afterwards. Listen to your body
              and stop if you feel any pain.
            </Text>
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderRadius: 20,
  },
  section: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
  },
  tipsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  tipsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ExerciseDetailsScreen;
