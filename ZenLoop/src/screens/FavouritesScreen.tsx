import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleFavourite } from '../redux/slices/favouritesSlice';
import { Exercise } from '../types';
import { COLORS, DIFFICULTY_COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants';
import { Card, Badge, EmptyState } from '../components';

interface FavouritesScreenProps {
  navigation: any;
}

const FavouritesScreen: React.FC<FavouritesScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items: favourites } = useAppSelector((state) => state.favourites);
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRemoveFavourite = (exercise: Exercise) => {
    dispatch(toggleFavourite(exercise));
  };

  const renderFavouriteCard = ({ item, index }: { item: Exercise; index: number }) => {
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
            translateX: cardAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            }),
          }],
        }}
      >
        <Card
          onPress={() => navigation.navigate('Home', {
            screen: 'ExerciseDetails',
            params: { exercise: item }
          })}
          isDarkMode={isDarkMode}
          style={styles.card}
        >
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, { backgroundColor: colors.accent + '15' }]}>
              <Feather name="heart" size={28} color={colors.accent} />
            </View>

            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.muscleRow}>
                <Feather name="target" size={12} color={colors.secondary} />
                <Text style={[styles.cardMuscle, { color: colors.secondary }]}>
                  {item.muscle.toUpperCase()}
                </Text>
              </View>
              <View style={styles.badgeRow}>
                <Badge
                  text={item.difficulty.toUpperCase()}
                  color={difficultyColor}
                  size="small"
                />
              </View>
            </View>

            <Card
              onPress={() => handleRemoveFavourite(item)}
              isDarkMode={isDarkMode}
              style={[styles.removeButton, { backgroundColor: colors.error + '10' }]}
              elevated={false}
            >
              <Feather name="x" size={18} color={colors.error} />
            </Card>
          </View>
        </Card>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.header, { backgroundColor: colors.card, opacity: fadeAnim }, SHADOWS.sm]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>My Favourites</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Your saved exercises
            </Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: colors.accent }]}>
            <Text style={styles.countText}>{favourites.length}</Text>
          </View>
        </View>
      </Animated.View>

      <FlatList
        data={favourites}
        renderItem={renderFavouriteCard}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="heart"
            title="No Favourites Yet"
            description="Start adding exercises to your favourites by tapping the heart icon on any exercise card"
            isDarkMode={isDarkMode}
          />
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.md,
  },
  countBadge: {
    minWidth: 44,
    height: 44,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  countText: {
    color: '#fff',
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  listContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.massive,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  cardTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
  muscleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  cardMuscle: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
});

export default FavouritesScreen;
