import { StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { Column, Row } from '../../components/Layout';
import { Formik } from 'formik';
import AppFormInput from '../../components/FormInput';
import AppButton, { AppIconButton } from '../../components/Button';
import AppScreen from '../../components/AppScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthProvider, RegisterPayload } from '../../types/auth';
import AppActivityLoader from '../../components/Loader';
import { colors } from '../../theme/colors';
import { useSnackbarStore } from '../../store/snackbarStore';
import {
  facebookSignInService,
  googleSignInService,
  registerService,
} from '../../services/auth.service';
import { isEmail, isNullOrEmpty } from '../../utils/string';
import { NavigateText } from './LoginScreen';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigation } from '../../navigation/types';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { LoginButton as FacebookSigninButton } from 'react-native-fbsdk-next';
import { UploadPicture } from '../../components/ProfilePicture';
import AppBar from '../../components/AppBar';
import { ERRORS } from '../../constants/errorConstants';
import { getLocales } from 'expo-localization';
import { ImagePickerAsset } from 'expo-image-picker';

type RegisteringData = {
  isLoading: boolean;
  provider: AuthProvider;
};


const DEFAULT_CURRENCY_CODE = 'PKR';


const RegisterScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [registeringData, setRegisteringData] = useState<RegisteringData>({
    isLoading: false,
    provider: 'email',
  });
  const [picture, setPicture] = useState<string | null>(null);

  const showSnackbar = useSnackbarStore(state => state.showSnackbar);
  const navigation = useNavigation<AuthNavigation>();

  const currentUserCurrencyCode = getLocales()[0]?.currencyCode ?? DEFAULT_CURRENCY_CODE;

  const register = async (data: RegisterPayload) => {
    setRegisteringData({ isLoading: true, provider: 'email' });

    // checking picture
    // asigning the picture
    if (picture) {
      data.picture = picture;
    }

    console.log(`Register Data: ${data}`);

    const res = await registerService(data);
    if (!res.success) {
      setRegisteringData(prev => ({ ...prev, isLoading: false }));
      showSnackbar(res.message, { type: 'error' });
      return;
    } else if (res.success) {
      // Stop Loading
      setRegisteringData(prev => ({ ...prev, isLoading: false }));
      // show Success Snackbar
      showSnackbar('Registered Successfully', { type: 'success' });
    }
  };

  const googleSignIn = async () => {
    setRegisteringData({ isLoading: true, provider: 'google' });

    const res = await googleSignInService({ baseCurrency: currentUserCurrencyCode });

    if (!res.success) {
      setRegisteringData(prev => ({ ...prev, isLoading: false }));

      showSnackbar(res.message, { type: 'error' });
      return;
    }

    if (res.success) {
      setRegisteringData(prev => ({ ...prev, isLoading: false }));

      // Success
      showSnackbar('SignedIn with Google Successfully');
    }
  };

  const facebookSignIn = async () => {
    setRegisteringData({ isLoading: true, provider: 'facebook' });

    const res = await facebookSignInService({ baseCurrency: currentUserCurrencyCode });

    if (!res.success) {
      setRegisteringData(prev => ({ ...prev, isLoading: false }));

      showSnackbar(res.message, { type: 'error' });
      return;
    } else if (res.success) {
      setRegisteringData(prev => ({ ...prev, isLoading: false }));

      // Success
      showSnackbar(res.message);
    }
  };

  return (
    <AppScreen>
      <Column style={{ flex: 1 }}>
        <AppBar
          title='Register'
        />

        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Formik<RegisterPayload>
            initialValues={{ 
              name: '',
              email: '',
              password: '',
              baseCurrency: currentUserCurrencyCode // GET Current User's Currency Code
            }}
            onSubmit={register}
          >
            {({ handleSubmit, submitCount }) => (
              <Column
                style={{
                  flex: 1,
                  justifyContent: 'center',
                }}
                spacing={20}
              >
                {/* User Picture */}
                <UploadPicture
                 onUpload={(imageAsset: ImagePickerAsset) => {
                  setPicture(imageAsset.uri || null);
                  console.log(`picture: ${picture}`)
                 }}
                 mode='gallery'
                 style={{ alignSelf: 'center' }}
                />

                {/* Name */}
                <AppFormInput
                  placeholder="Name"
                  name="name"
                  submitCount={submitCount}
                  validator={value => {
                    if (isNullOrEmpty(value)) {
                      return 'Name is required!';
                    }
                    return undefined;
                  }}
                />

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
                  helperText="password is must be atleast 6 characters long"
                  name="password"
                  submitCount={submitCount}
                  validator={value => {
                    if (value.trim().length < 6) {
                      return 'error! password must be atleast 6 characters long.';
                    }
                    return undefined;
                  }}
                />

                {/*  Register, Facebook SignIn & Google SignIn Button here */}
                <Column style={{ paddingTop: 20 }} spacing={10}>
                  {/* Register Button */}
                  <AppButton
                    disabled={registeringData.isLoading}
                    onPress={(e) => handleSubmit()}
                    fullWidth
                  >
                    {registeringData.isLoading &&
                    registeringData.provider === 'email' ? (
                      <AppActivityLoader size={'small'} color={colors.white} />
                    ) : (
                      'Register'
                    )}
                  </AppButton>

                  <GoogleSigninButton
                    onPress={googleSignIn}
                    disabled={registeringData.isLoading}
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
                  style={{ paddingTop: 5 }}
                  message="Already have Account?"
                  highlightedText="login"
                  onPress={() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'login' }]
                    });
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

export default RegisterScreen;
