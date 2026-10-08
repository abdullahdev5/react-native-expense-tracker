import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  ColorValue,
  View,
} from 'react-native';
import React, { useState } from 'react';
import AppText from '../../components/Text';
import { useTheme } from '../../theme/ThemeProvider';
import { Column } from '../../components/Layout';
import { Formik } from 'formik';
import AppFormInput from '../../components/FormInput';
import AppButton, { AppIconButton } from '../../components/Button';
import AppScreen from '../../components/AppScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthProvider, LoginPayload } from '../../types/auth';
import AppActivityLoader from '../../components/Loader';
import { colors } from '../../theme/colors';
import { isEmail } from '../../utils/string';
import {
  facebookSignInService,
  googleSignInService,
  loginService,
} from '../../services/auth.service';
import { useSnackbarStore } from '../../store/snackbarStore';
import { userStore } from '../../store/userStore';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigation } from '../../navigation/types';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { LoginButton as FacebookSigninButton } from 'react-native-fbsdk-next';
import AppBar from '../../components/AppBar';
import { ERRORS } from '../../constants/errorConstants';

type LoggingData = {
  isLoading: boolean;
  provider: AuthProvider;
};

const LoginScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [loggingData, setLoggingData] = useState<LoggingData>({
    isLoading: false,
    provider: 'email',
  });
  const showSnackbar = useSnackbarStore(s => s.showSnackbar);
  const navigation = useNavigation<AuthNavigation>();

  const login = async (data: LoginPayload) => {
    setLoggingData({ isLoading: true, provider: 'email' });
    console.log(`Login Data: (email) ${data.email}`);

    const res = await loginService(data);
    if (!res.success) {
      setLoggingData(prev => ({ ...prev, isLoading: false }));
      showSnackbar(res.message, { type: 'error' });
      return;
    } else if (res.success) {
      // Stop Loading
      setLoggingData(prev => ({ ...prev, isLoading: false }));
      // show Success Snackbar
      showSnackbar(res.message, { type: 'success' });
    }
  };

  const googleSignIn = async () => {
    setLoggingData({ isLoading: true, provider: 'google' });

    const res = await googleSignInService();

    if (!res.success) {
      setLoggingData(prev => ({ ...prev, isLoading: false }));

      showSnackbar(res.message, { type: 'error' });
      return;
    } else if (res.success) {
      setLoggingData(prev => ({ ...prev, isLoading: false }));

      // Success
      showSnackbar('SignedIn with Google Successfully');
    }
  };

  const facebookSignIn = async () => {
    setLoggingData({ isLoading: true, provider: 'facebook' });

    const res = await facebookSignInService();

    if (!res.success) {
      setLoggingData(prev => ({ ...prev, isLoading: false }));

      showSnackbar(res.message, { type: 'error' });
      return;
    } else if (res.success) {
      setLoggingData(prev => ({ ...prev, isLoading: false }));

      // Success
      showSnackbar('SignedIn with Facebook Successfully');
    }
  };

  return (
    <AppScreen>
      <Column style={{ flex: 1 }}>
        <AppBar
          title='Login'
        />

        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <Formik<LoginPayload>
            initialValues={{ email: '', password: '' }}
            onSubmit={async (values, { resetForm }) => {
              await login(values);
              resetForm();
            }}
          >
            {({ handleSubmit, submitCount }) => (
              <Column
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
                spacing={20}
              >
                {/* Email */}
                <AppFormInput
                  placeholder="Email"
                  keyboardType="email-address"
                  name="email"
                  submitCount={submitCount}
                  validator={value => {
                    if (!isEmail(value)) {
                      return 'Invalid Email!';
                    }
                    return undefined;
                  }}
                />

                {/* Password */}
                <AppFormInput
                  placeholder="Password"
                  name="password"
                  submitCount={submitCount}
                  validator={value => {
                    if (value.trim().length < 6) {
                      return 'error! password must be atleast 6 characters long.';
                    }
                    return undefined;
                  }}
                />

                {/*  Login, Facebook SignIn & Google SignIn Button here */}
                <Column style={{ paddingTop: 20 }} spacing={10}>
                  {/* Login Button */}
                  <AppButton
                    disabled={loggingData.isLoading}
                    onPress={() => handleSubmit()}
                    fullWidth
                  >
                    {loggingData.isLoading &&
                    loggingData.provider === 'email' ? (
                      <AppActivityLoader size={'small'} color={colors.white} />
                    ) : (
                      'Login'
                    )}
                  </AppButton>

                  <GoogleSigninButton
                    onPress={googleSignIn}
                    disabled={loggingData.isLoading}
                    color="light"
                    style={styles.googleSignInButton}
                  />

                  <FacebookSigninButton
                    style={styles.facebookSignInButton}
                    permissions={['public_profile', 'email']}
                    onLoginFinished={async (error, result) => {
                      if (error) {
                        return showSnackbar(error.toString(), { type: 'error' });
                      }

                      if (result.isCancelled) {
                        return showSnackbar(ERRORS.oops, {
                          type: 'error',
                        });
                      }

                      // getting Access Token and calling Api
                      await facebookSignIn();
                    }}
                  />
                </Column>

                {/* Don't have Account? create one */}
                <NavigateText
                  style={styles.navigateText}
                  message="don't have an Account?"
                  highlightedText="create one"
                  onPress={() => {
                    navigation.navigate('register');
                  }}
                />
              </Column>
            )}
          </Formik>
        </ScrollView>
      </Column>
    </AppScreen>
  );
};

export function NavigateText({
  message,
  highlightedText,
  highlightedTextColor,
  onPress,
  style,
}: {
  message: string;
  highlightedText: string;
  highlightedTextColor?: ColorValue;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={style}>
      <Text
        style={{ fontSize: theme.fontSize.small, color: theme.colors.text }}
      >
        {message}{' '}
        <Text
          style={{
            color: highlightedTextColor ?? theme.colors.primary,
            textDecorationLine: 'underline',
          }}
        >
          {highlightedText}
        </Text>
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  registertText: {
    marginTop: 70,
    alignSelf: 'center',
  },
  googleSignInButton: {
    width: '100%',
    height: 50,

  },
  facebookSignInButton: {
    width: '100%',
    height: 40,
  },
  navigateText: {
    paddingTop: 10,
  },
});

export default LoginScreen;
