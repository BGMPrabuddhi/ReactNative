import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logoutUser, updateUser } from '../redux/slices/authSlice';
import { toggleTheme, saveTheme } from '../redux/slices/themeSlice';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants';
import { Card, Avatar, Button } from '../components';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const { items: favourites } = useAppSelector((state) => state.favourites);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(user?.image || null);
  const [editedUser, setEditedUser] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user?.image) {
      setProfileImage(user.image);
    }
  }, [user]);

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access gallery is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        
        // Save immediately to persist the image
        try {
          await dispatch(updateUser({ image: imageUri })).unwrap();
          Alert.alert('Success', 'Profile picture updated!');
        } catch (error) {
          Alert.alert('Error', 'Failed to save profile picture');
          console.error('Save image error:', error);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Pick image error:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Basic validation
      if (!editedUser.username.trim()) {
        Alert.alert('Error', 'Username is required');
        return;
      }
      if (!editedUser.email.trim()) {
        Alert.alert('Error', 'Email is required');
        return;
      }

      // Dispatch update action with profile image
      await dispatch(updateUser({ ...editedUser, image: profileImage })).unwrap();
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setEditedUser({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    try {
      setPasswordError('');
      
      // Validation
      if (!passwordData.currentPassword.trim()) {
        setPasswordError('Current password is required');
        return;
      }
      if (!passwordData.newPassword.trim()) {
        setPasswordError('New password is required');
        return;
      }
      
      // New password validation
      if (passwordData.newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return;
      }
      
      if (!/[A-Z]/.test(passwordData.newPassword)) {
        setPasswordError('Password must contain at least one uppercase letter');
        return;
      }
      
      if (!/[0-9]/.test(passwordData.newPassword)) {
        setPasswordError('Password must contain at least one number');
        return;
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New password and confirm password do not match');
        return;
      }

      // Verify current password by attempting to authenticate
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const { STORAGE_KEYS } = await import('../constants');
      
      // Get all stored data
      const [registeredUsersJson, userDataJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA)
      ]);
      
      console.log('=== Password Change Debug ===');
      console.log('Current user from Redux:', user);
      console.log('User data from storage:', userDataJson);
      console.log('Registered users:', registeredUsersJson);
      
      if (!registeredUsersJson) {
        setPasswordError('Password change not available for demo accounts');
        return;
      }

      const registeredUsers = JSON.parse(registeredUsersJson);
      console.log('Parsed registered users:', registeredUsers);
      
      // Find user by username or email
      const currentUserIndex = registeredUsers.findIndex((u: any) => {
        const usernameMatch = u.username === user?.username;
        const emailMatch = u.email === user?.email;
        console.log(`Checking user: ${u.username}, username match: ${usernameMatch}, email match: ${emailMatch}`);
        return usernameMatch || emailMatch;
      });
      
      console.log('Found user at index:', currentUserIndex);
      
      if (currentUserIndex === -1) {
        setPasswordError('Password change not available for demo accounts');
        return;
      }

      const storedUser = registeredUsers[currentUserIndex];
      console.log('Stored user:', storedUser);
      console.log('Stored password:', storedUser.password);
      console.log('Entered password:', passwordData.currentPassword);
      console.log('Passwords match:', storedUser.password === passwordData.currentPassword);
      console.log('Password lengths - stored:', storedUser.password?.length, 'entered:', passwordData.currentPassword.length);
      
      // Check if user has no password stored (old registration before password field was added)
      if (!storedUser.password || storedUser.password === undefined) {
        // Allow user to set their first password
        // In this case, skip current password verification since there is no current password
        registeredUsers[currentUserIndex].password = passwordData.newPassword;
        await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers));
        
        Alert.alert('Success', 'Password set successfully! You can now use this password to change it in the future.');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordError('');
        setIsChangingPassword(false);
        return;
      }
      
      // Verify current password matches (trim whitespace)
      if (storedUser.password?.trim() !== passwordData.currentPassword.trim()) {
        setPasswordError('Current password is incorrect');
        return;
      }
      
      // Update password in the array
      registeredUsers[currentUserIndex].password = passwordData.newPassword;
      await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registeredUsers));
      
      console.log('Password updated successfully');

      Alert.alert('Success', 'Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordError('');
      setIsChangingPassword(false);
    } catch (error: any) {
      console.error('Password change error:', error);
      setPasswordError(error?.message || 'Failed to change password');
    }
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordError('');
    setIsChangingPassword(false);
  };

  const handleLogout = async () => {
    try {
      console.log('Logout button clicked');
      await dispatch(logoutUser()).unwrap();
      console.log('Logout successful - should navigate to login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    dispatch(saveTheme(!isDarkMode));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }, SHADOWS.sm]}>
        <Avatar
          source={profileImage}
          name={user?.firstName?.[0] || user?.username?.[0] || 'U'}
          size="xlarge"
          isDarkMode={isDarkMode}
          onPress={handlePickImage}
          showEditBadge
        />
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
        <Card isDarkMode={isDarkMode} style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Feather name="heart" size={28} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.text }]}>{favourites.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favourites</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Feather name="activity" size={28} color={colors.secondary} />
            <Text style={[styles.statValue, { color: colors.text }]}>ZenLoop</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Member</Text>
          </View>
        </Card>

        <Card isDarkMode={isDarkMode} style={styles.section}>
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
        </Card>

        <Card isDarkMode={isDarkMode} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Feather name="edit-2" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <View>
              {/* First Name */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>First Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={editedUser.firstName}
                  onChangeText={(text) => setEditedUser({ ...editedUser, firstName: text })}
                  placeholder="Enter first name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              {/* Last Name */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Last Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={editedUser.lastName}
                  onChangeText={(text) => setEditedUser({ ...editedUser, lastName: text })}
                  placeholder="Enter last name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              {/* Username */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Username</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={editedUser.username}
                  onChangeText={(text) => setEditedUser({ ...editedUser, username: text })}
                  placeholder="Enter username"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="none"
                />
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={editedUser.email}
                  onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
                  placeholder="Enter email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton, { borderColor: colors.border }]}
                  onPress={handleCancelEdit}
                >
                  <Text style={[styles.actionButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton, { backgroundColor: colors.primary }]}
                  onPress={handleSaveProfile}
                >
                  <Text style={[styles.actionButtonText, { color: '#fff' }]}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              {/* Display Mode */}
              <View style={styles.infoRow}>
                <Feather name="user" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Name</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.username || 'Not set'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Feather name="at-sign" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Username</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {user?.username || 'Not set'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Feather name="mail" size={20} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {user?.email || 'Not set'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Card>

        <Card isDarkMode={isDarkMode} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>
            {!isChangingPassword && (
              <TouchableOpacity onPress={() => setIsChangingPassword(true)}>
                <Feather name="lock" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {isChangingPassword ? (
            <View>
              {/* Current Password */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Current Password</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={passwordData.currentPassword}
                  onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {/* New Password */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>New Password</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={passwordData.newPassword}
                  onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Confirm New Password</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {/* Error Message */}
              {passwordError ? (
                <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
                  <Feather name="alert-circle" size={16} color={colors.error} />
                  <Text style={[styles.errorText, { color: colors.error }]}>{passwordError}</Text>
                </View>
              ) : null}

              {/* Action Buttons */}
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton, { borderColor: colors.border }]}
                  onPress={handleCancelPasswordChange}
                >
                  <Text style={[styles.actionButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton, { backgroundColor: colors.primary }]}
                  onPress={handleChangePassword}
                >
                  <Text style={[styles.actionButtonText, { color: '#fff' }]}>Change Password</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.infoRow}>
              <Feather name="lock" size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Password</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>••••••••</Text>
              </View>
            </View>
          )}
        </Card>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          icon="log-out"
          iconPosition="left"
          isDarkMode={isDarkMode}
          style={styles.logoutButton}
        />

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
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.lg,
  },
  name: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONTS.sizes.md,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  divider: {
    width: 1,
    marginHorizontal: SPACING.lg,
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  settingText: {
    fontSize: FONTS.sizes.md,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: FONTS.sizes.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  infoContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  infoLabel: {
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium,
  },
  editActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  saveButton: {
    borderWidth: 0,
  },
  actionButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  errorText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
  },
  logoutButton: {
    marginBottom: SPACING.lg,
  },
  version: {
    textAlign: 'center',
    fontSize: FONTS.sizes.xs,
    marginBottom: SPACING.lg,
  },
});

export default ProfileScreen;
