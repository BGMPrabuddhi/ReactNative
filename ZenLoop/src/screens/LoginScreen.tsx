import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginUser, clearError } from '../redux/slices/authSlice';
import { loginValidationSchema } from '../utils/validation';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants';
import { Input, Button } from '../components';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    if (error) {
      setLoginError(error);
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  const handleLogin = async () => {
    setLoginError(null);
    const isValid = await validateForm();
    if (isValid) {
      dispatch(loginUser({ username, password }));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        overScrollMode="never"
      >
        {/* Animated Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Image 
            source={require('../../assets/Logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <View style={styles.welcomeSection}>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back!</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Log in to continue your wellness journey
            </Text>
          </View>
        </Animated.View>

        {/* Animated Form */}
        <Animated.View 
          style={[
            styles.form,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Input
            label="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (errors.username) setErrors({ ...errors, username: undefined });
            }}
            placeholder="Enter your username"
            icon="user"
            error={errors.username}
            success={username.length > 0 && !errors.username}
            isDarkMode={isDarkMode}
            autoCapitalize="none"
            editable={!loading}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            placeholder="Enter your password"
            icon="lock"
            error={errors.password}
            success={password.length > 0 && !errors.password}
            showPasswordToggle
            isDarkMode={isDarkMode}
            editable={!loading}
          />

          {/* Login Error */}
          {loginError && (
            <View style={[styles.errorContainer, { backgroundColor: colors.error + '15', borderColor: colors.error + '40' }]}>
              <Feather name="alert-circle" size={16} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {loginError}
              </Text>
            </View>
          )}

          {/* Login Button */}
          <Button
            title="Log In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            icon="arrow-right"
            variant="primary"
            size="large"
            isDarkMode={isDarkMode}
            style={styles.loginButton}
          />

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
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.massive,
    paddingBottom: SPACING.huge,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logo: {
    width: 180,
    height: 80,
    marginBottom: SPACING.xxl,
  },
  welcomeSection: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  errorText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    flex: 1,
  },
  loginButton: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONTS.sizes.md,
  },
  linkText: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
  },
});

export default LoginScreen;
