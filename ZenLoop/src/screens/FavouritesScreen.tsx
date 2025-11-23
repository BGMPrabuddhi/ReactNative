import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleFavourite, saveFavourites } from '../redux/slices/favouritesSlice';
import { Exercise } from '../types';
import { COLORS, DIFFICULTY_COLORS } from '../constants/colors';

interface FavouritesScreenProps {
  navigation: any;
}

const FavouritesScreen: React.FC<FavouritesScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items: favourites } = useAppSelector((state) => state.favourites);
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.auth);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const handleRemoveFavourite = (exercise: Exercise) => {
    dispatch(toggleFavourite(exercise));
    dispatch(saveFavourites(favourites.filter((fav) => fav.name !== exercise.name)));
  };

  const renderFavouriteCard = ({ item }: { item: Exercise }) => {
    const difficultyColor =
      DIFFICULTY_COLORS[item.difficulty as keyof typeof DIFFICULTY_COLORS] || colors.textSecondary;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => navigation.navigate('Home', {
          screen: 'ExerciseDetails',
          params: { exercise: item }
        })}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
            <Feather name="heart" size={28} color={colors.accent} />
          </View>

          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.cardMuscle, { color: colors.textSecondary }]}>
              <Feather name="target" size={12} /> {item.muscle.toUpperCase()}
            </Text>
            <View style={styles.cardFooter}>
              <View style={[styles.badge, { backgroundColor: difficultyColor + '20' }]}>
                <Text style={[styles.badgeText, { color: difficultyColor }]}>
                  {item.difficulty.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleRemoveFavourite(item)}
            style={styles.removeButton}
          >
            <Feather name="x" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Favourites</Text>
        <View style={[styles.countBadge, { backgroundColor: colors.accent }]}>
          <Text style={styles.countText}>{favourites.length}</Text>
        </View>
      </View>

      <FlatList
        data={favourites}
        renderItem={renderFavouriteCard}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="heart" size={80} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Favourites Yet</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Start adding exercises to your favourites by tapping the heart icon
            </Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  countBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  countText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardMuscle: {
    fontSize: 12,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FavouritesScreen;
