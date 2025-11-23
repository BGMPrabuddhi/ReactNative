import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
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

  const handleLogin = async () => {
    const isValid = await validateForm();
    if (isValid) {
      dispatch(loginUser({ username, password }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Feather name="activity" size={60} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>ZenLoop</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your Wellness Journey Starts Here
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color={colors.textSecondary} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Username"
              placeholderTextColor={colors.textSecondary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color={colors.textSecondary} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textSecondary}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.demoInfo}>
            <Text style={[styles.demoText, { color: colors.textSecondary }]}>Demo Credentials:</Text>
            <Text style={[styles.demoText, { color: colors.textSecondary }]}>
              Username: emilys
            </Text>
            <Text style={[styles.demoText, { color: colors.textSecondary }]}>
              Password: emilyspass
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 12,
  },
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  demoInfo: {
    marginTop: 30,
    padding: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
  },
  demoText: {
    fontSize: 12,
    marginVertical: 2,
  },
});

export default LoginScreen;
