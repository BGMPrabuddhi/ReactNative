import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Image,
  Keyboard,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchExercises } from '../redux/slices/exercisesSlice';
import { toggleFavourite, loadFavourites } from '../redux/slices/favouritesSlice';
import { Exercise } from '../types';
import { COLORS, MUSCLE_GROUPS, DIFFICULTY_COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants';
import { Card, Badge, EmptyState, LoadingSpinner, SearchBar, Avatar } from '../components';

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
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [searchFocusAnim] = useState(new Animated.Value(0));
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    dispatch(loadFavourites());
    dispatch(fetchExercises(undefined));
    loadRecentSearches();
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem('@zenloop_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    if (!query.trim() || query.length < 2) return;
    
    try {
      const updated = [query, ...recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      await AsyncStorage.setItem('@zenloop_recent_searches', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem('@zenloop_recent_searches');
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchExercises(selectedMuscle));
  };

  const handleMuscleFilter = (muscle: string) => {
    const newMuscle = muscle === selectedMuscle ? undefined : muscle;
    setSelectedMuscle(newMuscle);
    dispatch(fetchExercises(newMuscle));
  };

  const handleDifficultyFilter = (difficulty: string) => {
    setSelectedDifficulty(difficulty === selectedDifficulty ? undefined : difficulty);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    Animated.timing(searchFocusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    Animated.timing(searchFocusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
    }
    Keyboard.dismiss();
    handleSearchBlur();
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleSelectSuggestion = (query: string) => {
    setSearchQuery(query);
    saveRecentSearch(query);
    Keyboard.dismiss();
    handleSearchBlur();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty(undefined);
    setSelectedMuscle(undefined);
    dispatch(fetchExercises(undefined));
  };

  const hasActiveFilters = searchQuery || selectedDifficulty || selectedMuscle;

  const handleToggleFavourite = (exercise: Exercise) => {
    dispatch(toggleFavourite(exercise));
  };

  const isFavourite = (exercise: Exercise) => {
    return favourites.some((fav) => fav.name === exercise.name);
  };

  const filteredExercises = exercises.filter((exercise) => {
    // Search filter
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Difficulty filter
    const matchesDifficulty = !selectedDifficulty || exercise.difficulty === selectedDifficulty;
    
    // Muscle filter (already handled by API, but double check)
    const matchesMuscle = !selectedMuscle || exercise.muscle.toLowerCase() === selectedMuscle.toLowerCase();
    
    return matchesSearch && matchesDifficulty && matchesMuscle;
  });

  const filteredFavourites = filteredExercises.filter((exercise) => isFavourite(exercise));
  
  const uniqueMusclesInFiltered = new Set(filteredExercises.map(ex => ex.muscle.toLowerCase())).size;

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts;
  };

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

  const renderExerciseCard = ({ item, index }: { item: Exercise; index: number }) => {
    const favourite = isFavourite(item);
    const difficultyColor = DIFFICULTY_COLORS[item.difficulty as keyof typeof DIFFICULTY_COLORS] || colors.textSecondary;
    
    const cardAnim = new Animated.Value(0);
    Animated.spring(cardAnim, {
      toValue: 1,
      delay: index * 50,
      useNativeDriver: true,
      tension: 40,
      friction: 7,
    }).start();

    return (
      <Animated.View
        style={{
          opacity: cardAnim,
          transform: [{
            translateY: cardAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        }}
      >
        <Card
          onPress={() => navigation.navigate('ExerciseDetails', { exercise: item })}
          isDarkMode={isDarkMode}
          style={styles.card}
        >
          {/* Accent Bar */}
          <View style={[styles.accentBar, { backgroundColor: difficultyColor }]} />
          
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleSection}>
              <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                {searchQuery ? (
                  highlightText(item.name, searchQuery).map((part: string, i: number) => (
                    <Text
                      key={i}
                      style={
                        part.toLowerCase() === searchQuery.toLowerCase()
                          ? { backgroundColor: colors.primary + '30', color: colors.primary }
                          : {}
                      }
                    >
                      {part}
                    </Text>
                  ))
                ) : (
                  item.name
                )}
              </Text>
              <View style={styles.muscleRow}>
                <Feather name="target" size={14} color={colors.secondary} />
                <Text style={[styles.cardMuscle, { color: colors.secondary }]}>
                  {item.muscle.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={() => handleToggleFavourite(item)}
              style={[styles.favouriteButton, { backgroundColor: favourite ? colors.accent + '15' : colors.background }]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather 
                name="heart" 
                size={22} 
                color={favourite ? colors.accent : colors.textSecondary} 
                fill={favourite ? colors.accent : 'none'} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.cardFooter}>
            <Badge
              text={item.difficulty.toUpperCase()}
              color={difficultyColor}
              icon="trending-up"
              size="small"
            />
            <Badge
              text={item.equipment.replace('_', ' ').toUpperCase()}
              color={colors.info}
              icon="tool"
              size="small"
            />
          </View>
        </Card>
      </Animated.View>
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
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        onPress={() => handleMuscleFilter(item)}
        activeOpacity={0.7}
      >
        <Feather 
          name={getMuscleIcon(item)} 
          size={16} 
          color={isSelected ? '#fff' : colors.text} 
          style={styles.chipIcon}
        />
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
      {/* Enhanced Header */}
      <Animated.View style={[styles.header, { backgroundColor: colors.card, opacity: fadeAnim }, SHADOWS.sm]}>
        <View style={styles.headerRow}>
          <Image 
            source={require('../../assets/Logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />

          <Avatar
            source={user?.image}
            name={user?.firstName?.[0] || user?.username?.[0] || 'U'}
            size="small"
            isDarkMode={isDarkMode}
            onPress={() => navigation.navigate('Profile')}
          />
        </View>
      </Animated.View>

      {/* Welcome Section */}
      <Animated.View style={[styles.welcomeSection, { opacity: fadeAnim }]}>
        <Text style={[styles.welcomeTitle, { color: colors.text }]}>
          Hi, {user?.firstName || user?.username || 'there'}! 👋
        </Text>
        <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
          Ready to crush your fitness goals? Let's find the perfect workout for you!
        </Text>

        {/* Enhanced Search Bar with Focus State */}
        <Animated.View style={[
          styles.searchContainer,
          {
            transform: [{
              scale: searchFocusAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.02],
              }),
            }],
          },
        ]}>
          <View style={[styles.searchInputContainer, { backgroundColor: colors.card }, SHADOWS.sm]}>
            <Feather name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search exercises..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Feather name="x-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Suggestions - Recent Searches Only */}
          {isSearchFocused && searchQuery.length === 0 && recentSearches.length > 0 && (
            <Animated.View
              style={[
                styles.suggestionsPanel,
                { backgroundColor: colors.card, opacity: searchFocusAnim },
                SHADOWS.md,
              ]}
            >
              <View style={styles.suggestionsSection}>
                <View style={styles.suggestionHeader}>
                  <Text style={[styles.suggestionTitle, { color: colors.text }]}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={[styles.clearText, { color: colors.primary }]}>Clear</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item)}
                  >
                    <Feather name="clock" size={16} color={colors.textSecondary} />
                    <Text style={[styles.suggestionText, { color: colors.text }]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}
        </Animated.View>

        {/* Difficulty Filters */}
        {!isSearchFocused && (
          <View style={styles.difficultyFilters}>
            {['beginner', 'intermediate', 'expert'].map((difficulty) => {
              const isSelected = selectedDifficulty === difficulty;
              const difficultyColor = DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS];
              const difficultyIcons = {
                beginner: 'check-circle',
                intermediate: 'zap',
                expert: 'award',
              };
              
              return (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.difficultyChip,
                    {
                      backgroundColor: isSelected ? difficultyColor + '20' : colors.card,
                      borderColor: isSelected ? difficultyColor : colors.border,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => handleDifficultyFilter(difficulty)}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={difficultyIcons[difficulty as keyof typeof difficultyIcons] as any}
                    size={14}
                    color={isSelected ? difficultyColor : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.difficultyText,
                      { color: isSelected ? difficultyColor : colors.textSecondary },
                    ]}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Results Header with Count and Clear Filters - Below Difficulty Filters */}
        {(searchQuery || selectedDifficulty || selectedMuscle) && (
          <View style={[styles.resultsHeaderInline, { backgroundColor: colors.card, borderColor: colors.border }, SHADOWS.sm]}>
            <View style={styles.resultsInfo}>
              <Feather name="filter" size={16} color={colors.text} />
              <Text style={[styles.resultsCount, { color: colors.text }]}>
                {filteredExercises.length} {filteredExercises.length === 1 ? 'Result' : 'Results'}
              </Text>
            </View>
            {hasActiveFilters && (
              <TouchableOpacity
                style={[styles.clearFiltersBtn, { backgroundColor: colors.primary + '15' }]}
                onPress={handleClearAllFilters}
                activeOpacity={0.7}
              >
                <Feather name="x" size={14} color={colors.primary} />
                <Text style={[styles.clearFiltersText, { color: colors.primary }]}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Stats Cards - Show Filtered Counts */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.primary + '15' }]}>
            <Feather name="list" size={20} color={colors.primary} />
            <Text style={[styles.statNumber, { color: colors.primary }]}>{filteredExercises.length}</Text>
            <Text style={[styles.statLabel, { color: colors.primary }]}>
              {selectedDifficulty || searchQuery ? 'Filtered' : 'Exercises'}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.accent + '15' }]}>
            <Feather name="heart" size={20} color={colors.accent} />
            <Text style={[styles.statNumber, { color: colors.accent }]}>{filteredFavourites.length}</Text>
            <Text style={[styles.statLabel, { color: colors.accent }]}>Favourites</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.secondary + '15' }]}>
            <Feather name="target" size={20} color={colors.secondary} />
            <Text style={[styles.statNumber, { color: colors.secondary }]}>
              {uniqueMusclesInFiltered}
            </Text>
            <Text style={[styles.statLabel, { color: colors.secondary }]}>Muscles</Text>
          </View>
        </View>
      </Animated.View>

      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseCard}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={handleRefresh} 
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          loading ? (
            <LoadingSpinner 
              text="Loading exercises..." 
              isDarkMode={isDarkMode}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Feather 
                name={searchQuery ? "search" : selectedMuscle ? "filter" : "inbox"} 
                size={64} 
                color={colors.textSecondary} 
              />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {searchQuery 
                  ? "No matches found" 
                  : selectedMuscle 
                    ? "No exercises in this category" 
                    : "No exercises available"}
              </Text>
              <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                {searchQuery 
                  ? `No results for "${searchQuery}". Try different keywords.`
                  : selectedMuscle 
                    ? `No ${selectedMuscle} exercises found. Try another muscle group.`
                    : "Start by searching or filtering exercises above."}
              </Text>
              {hasActiveFilters ? (
                <TouchableOpacity
                  style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                  onPress={handleClearAllFilters}
                  activeOpacity={0.8}
                >
                  <Feather name="x" size={18} color="#fff" />
                  <Text style={styles.emptyButtonText}>Clear Filters</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                  onPress={handleRefresh}
                  activeOpacity={0.8}
                >
                  <Feather name="refresh-cw" size={18} color="#fff" />
                  <Text style={styles.emptyButtonText}>Refresh</Text>
                </TouchableOpacity>
              )}
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
    paddingHorizontal: SPACING.lg,
    paddingTop: 50,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
  },
  welcomeSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },
  welcomeTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    lineHeight: FONTS.sizes.xxl * FONTS.lineHeights.tight,
  },
  welcomeSubtitle: {
    fontSize: FONTS.sizes.md,
    lineHeight: FONTS.sizes.md * FONTS.lineHeights.relaxed,
  },
  searchContainer: {
    marginTop: SPACING.md,
    position: 'relative',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    paddingVertical: 0,
  },
  suggestionsPanel: {
    marginTop: SPACING.sm,
    borderRadius: RADIUS.lg,
    maxHeight: 300,
    overflow: 'hidden',
  },
  suggestionsSection: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  suggestionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  clearText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  suggestionText: {
    flex: 1,
    fontSize: FONTS.sizes.md,
  },
  difficultyFilters: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  difficultyChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  difficultyText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  resultsHeaderInline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    borderWidth: 1,
  },
  resultsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  resultsCount: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
  },
  clearFiltersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  clearFiltersText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.massive,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
    lineHeight: FONTS.sizes.md * FONTS.lineHeights.relaxed,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
  },
  searchBar: {
    marginTop: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  statCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statNumber: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
  },
  filterContainer: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  chipIcon: {
    marginRight: SPACING.xs,
  },
  filterText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
  },
  listContainer: {
    padding: SPACING.xl,
    paddingBottom: SPACING.massive,
  },
  card: {
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    paddingLeft: SPACING.sm,
  },
  cardTitleSection: {
    flex: 1,
    marginRight: SPACING.md,
  },
  favouriteButton: {
    padding: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  cardTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
    lineHeight: FONTS.sizes.lg * FONTS.lineHeights.tight,
  },
  muscleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  cardMuscle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
  },
});

export default HomeScreen;
