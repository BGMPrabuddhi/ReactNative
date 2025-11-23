import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerUser, clearError } from '../redux/slices/authSlice';
import { registerValidationSchema } from '../utils/validation';
import { COLORS } from '../constants/colors';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      Alert.alert('Registration Failed', error);
      dispatch(clearError());
    }
  }, [error]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = async () => {
    try {
      await registerValidationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const validationErrors: any = {};
      err.inner.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleRegister = async () => {
    const isValid = await validateForm();
    if (isValid) {
      const result = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(result)) {
        Alert.alert(
          'Success',
          'Registration successful! Please login with your credentials.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
    }
  };

  const getInputStyle = (fieldName: string) => [
    styles.input,
    { 
      color: colors.text, 
      borderColor: errors[fieldName] ? colors.error : focusedField === fieldName ? colors.primary : colors.border,
      backgroundColor: colors.card,
      borderWidth: focusedField === fieldName ? 2 : 1,
      paddingRight: 40,
    }
  ];

  const getInputContainerStyle = (fieldName: string) => [
    styles.inputContainer,
    { 
      borderColor: errors[fieldName] ? colors.error : focusedField === fieldName ? colors.primary : colors.border,
      backgroundColor: colors.card,
      borderWidth: focusedField === fieldName ? 2 : 1,
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.brandSection}>
            <Text style={[styles.brandName, { color: colors.primary }]}>ZenLoop</Text>
            <Text style={[styles.taglineText, { color: colors.secondary }]}>Fitness & Wellness</Text>
          </View>
          
          <View style={styles.welcomeSection}>
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Join ZenLoop today</Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Email Field */}
          <View style={getInputContainerStyle('email')}>
            <Feather name="mail" size={20} color={focusedField === 'email' ? colors.primary : colors.textSecondary} style={styles.icon} />
            <TextInput
              style={[styles.inputField, { color: colors.text }]}
              placeholder="Email Address"
              placeholderTextColor={colors.textSecondary}
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              autoComplete="email"
            />
            {formData.email.length > 0 && !errors.email && (
              <Feather name="check-circle" size={20} color={colors.success} />
            )}
          </View>
          {errors.email && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={12} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text>
            </View>
          )}

          {/* Username Field */}
          <View style={getInputContainerStyle('username')}>
            <Feather name="user" size={20} color={focusedField === 'username' ? colors.primary : colors.textSecondary} style={styles.icon} />
            <TextInput
              style={[styles.inputField, { color: colors.text }]}
              placeholder="Username"
              placeholderTextColor={colors.textSecondary}
              value={formData.username}
              onChangeText={(text) => updateField('username', text)}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="none"
              editable={!loading}
              autoComplete="username"
            />
            {formData.username.length > 0 && !errors.username && (
              <Feather name="check-circle" size={20} color={colors.success} />
            )}
          </View>
          {errors.username && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={12} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.username}</Text>
            </View>
          )}

          {/* Password Field */}
          <View style={getInputContainerStyle('password')}>
            <Feather name="lock" size={20} color={focusedField === 'password' ? colors.primary : colors.textSecondary} style={styles.icon} />
            <TextInput
              style={[styles.inputField, { color: colors.text }]}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={formData.password}
              onChangeText={(text) => updateField('password', text)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!showPassword}
              editable={!loading}
              autoComplete="password-new"
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={12} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.password}</Text>
            </View>
          )}

          {/* Confirm Password Field */}
          <View style={getInputContainerStyle('confirmPassword')}>
            <Feather name="lock" size={20} color={focusedField === 'confirmPassword' ? colors.primary : colors.textSecondary} style={styles.icon} />
            <TextInput
              style={[styles.inputField, { color: colors.text }]}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textSecondary}
              value={formData.confirmPassword}
              onChangeText={(text) => updateField('confirmPassword', text)}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
              autoComplete="password-new"
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={12} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.confirmPassword}</Text>
            </View>
          )}

          {/* Password Requirements */}
          <View style={[styles.requirementsContainer, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
            <Text style={[styles.requirementsTitle, { color: colors.text }]}>Password Requirements:</Text>
            <View style={styles.requirementRow}>
              <Feather name="check" size={14} color={formData.password.length >= 6 ? colors.success : colors.textSecondary} />
              <Text style={[styles.requirementText, { color: colors.textSecondary }]}>At least 6 characters</Text>
            </View>
            <View style={styles.requirementRow}>
              <Feather name="check" size={14} color={/[A-Z]/.test(formData.password) ? colors.success : colors.textSecondary} />
              <Text style={[styles.requirementText, { color: colors.textSecondary }]}>One uppercase letter</Text>
            </View>
            <View style={styles.requirementRow}>
              <Feather name="check" size={14} color={/[0-9]/.test(formData.password) ? colors.success : colors.textSecondary} />
              <Text style={[styles.requirementText, { color: colors.textSecondary }]}>One number</Text>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.button, 
              { 
                backgroundColor: colors.primary,
                opacity: loading ? 0.7 : 1,
              }
            ]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={[styles.buttonText, { marginLeft: 8 }]}>Creating Account...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Sign Up</Text>
                <Feather name="arrow-right" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.linkText, { color: colors.primary }]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandName: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 1,
  },
  taglineText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  welcomeSection: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.8,
  },
  form: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  halfInputContainer: {
    flex: 1,
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
    height: 50,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 6,
  },
  requirementsContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  requirementText: {
    fontSize: 13,
    marginLeft: 8,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default RegisterScreen;
