import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchExercises } from '../redux/slices/exercisesSlice';
import { toggleFavourite, loadFavourites, saveFavourites } from '../redux/slices/favouritesSlice';
import { Exercise } from '../types';
import { COLORS, DIFFICULTY_COLORS } from '../constants/colors';
import { MUSCLE_GROUPS } from '../constants';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { exercises, loading } = useAppSelector((state) => state.exercises);
  const { items: favourites } = useAppSelector((state) => state.favourites);
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.auth);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const [selectedMuscle, setSelectedMuscle] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(loadFavourites());
    dispatch(fetchExercises(undefined));
  }, []);

  const handleRefresh = () => {
    dispatch(fetchExercises(selectedMuscle));
  };

  const handleMuscleFilter = (muscle: string) => {
    const newMuscle = muscle === selectedMuscle ? undefined : muscle;
    setSelectedMuscle(newMuscle);
    dispatch(fetchExercises(newMuscle));
  };

  const handleToggleFavourite = (exercise: Exercise) => {
    dispatch(toggleFavourite(exercise));
  };

  const isFavourite = (exercise: Exercise) => {
    return favourites.some((fav) => fav.name === exercise.name);
  };

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get icon based on muscle group
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

  const renderExerciseCard = ({ item }: { item: Exercise }) => {
    const favourite = isFavourite(item);
    const difficultyColor =
      DIFFICULTY_COLORS[item.difficulty as keyof typeof DIFFICULTY_COLORS] || colors.textSecondary;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => navigation.navigate('ExerciseDetails', { exercise: item })}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Feather name={getMuscleIcon(item.muscle)} size={28} color={colors.primary} />
          </View>
          <TouchableOpacity
            onPress={() => handleToggleFavourite(item)}
            style={styles.favouriteButton}
          >
            <Feather name="heart" size={24} color={favourite ? colors.accent : colors.border} fill={favourite ? colors.accent : 'none'} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.cardMuscle, { color: colors.textSecondary }]}>
          <Feather name="target" size={14} /> {item.muscle.toUpperCase()}
        </Text>

        <View style={styles.cardFooter}>
          <View style={[styles.badge, { backgroundColor: difficultyColor + '20' }]}>
            <Text style={[styles.badgeText, { color: difficultyColor }]}>
              {item.difficulty.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.secondary + '20' }]}>
            <Feather name="tool" size={12} color={colors.secondary} />
            <Text style={[styles.badgeText, { color: colors.secondary, marginLeft: 4 }]}>
              {item.equipment.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMuscleFilter = ({ item }: { item: string }) => {
    const isSelected = item === selectedMuscle;
    return (
      <TouchableOpacity
        style={[
          styles.filterChip,
          {
            backgroundColor: isSelected ? colors.primary : colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={() => handleMuscleFilter(item)}
      >
        <Text
          style={[
            styles.filterText,
            { color: isSelected ? '#fff' : colors.text },
          ]}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.headerRow}>
          {/* Brand Section - Left */}
          <View style={styles.brandSection}>
            <Text style={[styles.brandName, { color: colors.primary }]}>ZenLoop</Text>
            <Text style={[styles.tagline, { color: colors.secondary }]}>Wellness & Fitness</Text>
          </View>

          {/* User Profile Card - Right */}
          <View style={styles.profileCard}>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>
                  {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={[styles.welcomeSection, { backgroundColor: colors.background }]}>
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>
          Hi, {user?.firstName || user?.username || 'there'}! 👋
        </Text>
        <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
          Ready to crush your fitness goals today? Let's find the perfect workout for you!
        </Text>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Feather name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search exercises..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        horizontal
        data={MUSCLE_GROUPS}
        renderItem={renderMuscleFilter}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      />

      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseCard}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={60} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No exercises found
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandSection: {
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tagline: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
    marginTop: 2,
    opacity: 0.7,
  },
  profileCard: {
    padding: 0,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favouriteButton: {
    padding: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardMuscle: {
    fontSize: 14,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default HomeScreen;
