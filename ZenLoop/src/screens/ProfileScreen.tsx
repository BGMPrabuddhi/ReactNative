import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, TextInput, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logoutUser, updateUser } from '../redux/slices/authSlice';
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
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={handlePickImage} style={styles.avatarContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarLarge, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {(user?.firstName?.[0] || user?.username?.[0] || 'U').toUpperCase()}
              </Text>
            </View>
          )}
          <View style={[styles.editImageBadge, { backgroundColor: colors.primary }]}>
            <Feather name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
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
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
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
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
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
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
});

export default ProfileScreen;
