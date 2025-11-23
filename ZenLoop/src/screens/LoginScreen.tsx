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
import { loginUser, clearError } from '../redux/slices/authSlice';
import { loginValidationSchema } from '../utils/validation';
import { COLORS } from '../constants/colors';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
      dispatch(clearError());
    }
  }, [error]);

  const validateForm = async () => {
    try {
      await loginValidationSchema.validate(
        { username, password },
        { abortEarly: false }
      );
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

  const validateField = async (field: string, value: string) => {
    try {
      await loginValidationSchema.validateAt(field, { [field]: value });
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (err: any) {
      setErrors((prev: any) => ({ ...prev, [field]: err.message }));
    }
  };

  const handleBlur = (field: string) => {
    setFocusedField(null);
    setTouchedFields((prev) => new Set(prev).add(field));
    if (field === 'username') {
      validateField('username', username);
    } else if (field === 'password') {
      validateField('password', password);
    }
  };

  const handleLogin = async () => {
    const isValid = await validateForm();
    if (isValid) {
      dispatch(loginUser({ username, password }));
    }
  };

  const getInputBorderColor = (field: string) => {
    if (focusedField === field) {
      return colors.primary;
    }
    if (touchedFields.has(field) && errors[field]) {
      return colors.error;
    }
    if (touchedFields.has(field) && !errors[field]) {
      return colors.success;
    }
    return colors.border;
  };

  const getInputBorderWidth = (field: string) => {
    return focusedField === field ? 2 : 1;
  };

  const getIconColor = (field: string) => {
    if (focusedField === field) {
      return colors.primary;
    }
    if (touchedFields.has(field) && errors[field]) {
      return colors.error;
    }
    if (touchedFields.has(field) && !errors[field]) {
      return colors.success;
    }
    return colors.textSecondary;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.brandSection}>
            <Text style={[styles.brandName, { color: colors.primary }]}>ZenLoop</Text>
            <Text style={[styles.taglineText, { color: colors.secondary }]}>Fitness & Wellness</Text>
          </View>
          
          <View style={styles.welcomeSection}>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back!</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Log in to continue your wellness journey</Text>
          </View>
        </View>

        <View style={styles.form}>
          {/* Username Input */}
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: getInputBorderColor('username'),
                  borderWidth: getInputBorderWidth('username'),
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Feather
                name="user"
                size={20}
                color={getIconColor('username')}
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Username"
                placeholderTextColor={colors.textSecondary}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errors.username) {
                    setErrors((prev: any) => ({ ...prev, username: undefined }));
                  }
                }}
                onFocus={() => setFocusedField('username')}
                onBlur={() => handleBlur('username')}
                autoCapitalize="none"
                editable={!loading}
              />
              {touchedFields.has('username') && !errors.username && username && (
                <Feather name="check-circle" size={20} color={colors.success} />
              )}
            </View>
            {touchedFields.has('username') && errors.username && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={12} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.username}
                </Text>
              </View>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: getInputBorderColor('password'),
                  borderWidth: getInputBorderWidth('password'),
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Feather
                name="lock"
                size={20}
                color={getIconColor('password')}
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors((prev: any) => ({ ...prev, password: undefined }));
                  }
                }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => handleBlur('password')}
                secureTextEntry={!showPassword}
                editable={!loading}
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
            {touchedFields.has('password') && errors.password && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={12} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.password}
                </Text>
              </View>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.primary },
              loading && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.buttonText}>Logging In...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Log In</Text>
                <Feather name="arrow-right" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Register')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.linkText, { color: colors.primary }]}>Sign Up</Text>
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
  },
  scrollContent: {
    flexGrow: 1,
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
  inputWrapper: {
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
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
  button: {
    marginTop: 8,
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
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

export default LoginScreen;
