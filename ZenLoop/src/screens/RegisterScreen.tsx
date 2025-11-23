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
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (error) {
      Alert.alert('Registration Failed', error);
      dispatch(clearError());
    }
  }, [error]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Feather name="user-plus" size={50} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Join ZenLoop today
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={[styles.halfInputContainer, { marginRight: 8 }]}>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder="First Name"
                placeholderTextColor={colors.textSecondary}
                value={formData.firstName}
                onChangeText={(text) => updateField('firstName', text)}
                editable={!loading}
              />
            </View>
            <View style={styles.halfInputContainer}>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder="Last Name"
                placeholderTextColor={colors.textSecondary}
                value={formData.lastName}
                onChangeText={(text) => updateField('lastName', text)}
                editable={!loading}
              />
            </View>
          </View>
          {(errors.firstName || errors.lastName) && (
            <Text style={styles.errorText}>{errors.firstName || errors.lastName}</Text>
          )}

          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color={colors.textSecondary} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color={colors.textSecondary} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Username"
              placeholderTextColor={colors.textSecondary}
              value={formData.username}
              onChangeText={(text) => updateField('username', text)}
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
              value={formData.password}
              onChangeText={(text) => updateField('password', text)}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color={colors.textSecondary} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textSecondary}
              value={formData.confirmPassword}
              onChangeText={(text) => updateField('confirmPassword', text)}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Feather
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Login</Text>
            </TouchableOpacity>
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
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  halfInputContainer: {
    flex: 1,
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
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
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
});

export default RegisterScreen;
