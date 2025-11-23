import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logoutUser } from '../redux/slices/authSlice';
import { toggleTheme, saveTheme } from '../redux/slices/themeSlice';
import { COLORS } from '../constants/colors';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const { items: favourites } = useAppSelector((state) => state.favourites);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logoutUser()),
      },
    ]);
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    dispatch(saveTheme(!isDarkMode));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={[styles.avatarLarge, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.username || 'User'}
        </Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>
          {user?.email || 'email@example.com'}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Feather name="heart" size={24} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.text }]}>{favourites.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favourites</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Feather name="activity" size={24} color={colors.secondary} />
            <Text style={[styles.statValue, { color: colors.text }]}>ZenLoop</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Member</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Feather
                name={isDarkMode ? 'moon' : 'sun'}
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleToggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Feather name="user" size={20} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>Edit Profile</Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Feather name="settings" size={20} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>Settings</Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Feather name="help-circle" size={20} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>Help & Support</Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error + '20' }]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    marginHorizontal: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 20,
  },
});

export default ProfileScreen;
