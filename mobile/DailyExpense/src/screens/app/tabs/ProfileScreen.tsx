import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  FlatList,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import AppScreen from '../../../components/AppScreen';
import AppBar from '../../../components/AppBar';
import AppText from '../../../components/Text';
import { colors } from '../../../theme/colors';
import { useTheme } from '../../../theme/ThemeProvider';
import { userStore } from '../../../store/userStore';
import { User } from '../../../types/auth';
import { ThemeType } from '../../../theme';
import AppCard from '@components/Card';
import { Column, Row } from '@components/Layout';
import ProfilePicture, { UploadPicture } from '@components/ProfilePicture';
import { useWalletStore } from '../../../store/useWalletStore';
import AppActivityLoader from '@components/Loader';
import { Wallet } from '../../../types/wallet';
import WalletIconRenderer from '@components/feature/wallet/WalletIconRenderer';
import { useCategoryStore } from '../../../store/useCategoryStore';
import { Category } from '../../../types/category';
import CategoryIconRenderer from '@components/feature/category/CategoryIconRenderer';
import { getCategoryColor } from '../../../utils/category.utils';
import { useNavigation } from '@react-navigation/native';
import { AppNavigation } from '../../../navigation/types';
import AppButton, { AppIconButton } from '@components/Button';
import { Formik, FormikProps } from 'formik';
import { UpdateProfilePayload } from '../../../types/user';
import AppFormInput from '@components/FormInput';
import { isNullOrEmpty } from '../../../utils/string';
import { updateProfileService } from '../../../services/user.service';
import { useSnackbarStore } from '../../../store/snackbarStore';
import { CurrencyCode } from '../../../types/types';
import { UserPreferencesCard } from '@components/feature/profile/UserPreferencesCard';
import { CurrencyPickerModal } from '@components/feature/profile/CurrencyPickerModal';
import { useDashboardStore } from '../../../store/useDashboardStore';
import { useInsightsStore } from '../../../store/useInsightsStore';

const ProfileScreen = () => {
  const { theme } = useTheme();
  const user = userStore(s => s.user);
  const setUser = userStore(s => s.setUser);
  const refreshUser = userStore(s => s.refreshUser);
  const showSnackbar = useSnackbarStore(s => s.showSnackbar);
  const fetchDashboard = useDashboardStore(s => s.fetchDashboard);
  const fetchInsights = useInsightsStore(s => s.fetchInsights);
  const clearInsightsCache = useInsightsStore(s => s.clearCache);

  // Modal & UI State
  const [isEditProfileModalOpen, setEditProfileModal] = useState(false);
  const [isCurrencyModalOpen, setCurrencyModalOpen] = useState(false);

  // Wallet Store
  const wallets = useWalletStore(s => s.wallets);
  const walletsDisplay = wallets.slice(0, 3);
  const fetchWallets = useWalletStore(s => s.fetchWallets);
  const isWalletsLoading = useWalletStore(s => s.isLoading);
  // Category Store
  const categories = useCategoryStore(s => s.categories);

  const categoriesDisplay = useMemo(() => {
    const userCategories = categories.filter(cat => cat.isDefault === false);

    return userCategories.length > 0
      ? userCategories.slice(0, 3)
      : categories.slice(0, 3);
  }, [categories]);

  const fetchCategories = useCategoryStore(s => s.fetchCategories);
  const isCategoriesLoading = useCategoryStore(s => s.isLoading);

  useEffect(() => {
    if (!user) {
      refreshUser();
    }
  }, [user]);

  useEffect(() => {
    if (wallets.length === 0) {
      fetchWallets();
    }

    if (categories.length === 0) {
      fetchCategories();
    }
  }, [wallets, categories]);

  // 2. Handle updating base currency on server
  const handleCurrencyChange = async (selectedCurrencyCode: CurrencyCode) => {
    const res = await updateProfileService({
      baseCurrency: selectedCurrencyCode,
    });

    if (res.success && res.data) {


      setUser(res.data);
      // Fetch New Data with New Currency

      // Clear Previous Insights Cache
      clearInsightsCache();

      // fetch new data
      await Promise.all([
        fetchWallets(),
        fetchDashboard(),
        fetchInsights({ period: 'daily', type: 'expense', forceRefresh: true })
      ]);
      setCurrencyModalOpen(false);
      showSnackbar('Your base currency is updated!', { type: 'success' });
    } else {
      showSnackbar(res.message, { type: 'error' });
    }
  };

  return (
    <AppScreen>
      <AppBar title="Profile" showBackButton={false} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Column>
          {user && (
            <UserCard
              user={user}
              theme={theme}
              style={styles.userCard}
              onEditProfile={() => setEditProfileModal(true)}
            />
          )}
          {(isWalletsLoading || isCategoriesLoading) && (
            <AppActivityLoader style={{ alignSelf: 'center', margin: 20 }} />
          )}

          {walletsDisplay.length !== 0 && (
            <WalletsCard
              wallets={walletsDisplay}
              theme={theme}
              style={[styles.card]}
            />
          )}

          {categoriesDisplay.length !== 0 && (
            <CategoriesCard
              categories={categoriesDisplay}
              theme={theme}
              style={[styles.card]}
            />
          )}

          {user && (
            <UserPreferencesCard
              theme={theme}
              style={[styles.card]}
              currentCurrency={user.baseCurrency || 'PKR'}
              onPressCurrencySettings={() => setCurrencyModalOpen(true)}
            />
          )}
        </Column>
      </ScrollView>

      <Modal
        transparent
        animationType="slide"
        visible={isEditProfileModalOpen}
        onRequestClose={() => setEditProfileModal(false)}
        style={{
          backgroundColor: colors.transparent,
        }}
      >
        {user && (
          <EditProfileModal
            user={user}
            theme={theme}
            onDismiss={() => setEditProfileModal(false)}
          />
        )}
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={isCurrencyModalOpen}
        onRequestClose={() => setCurrencyModalOpen(false)}
      >
        <CurrencyPickerModal
          theme={theme}
          currentCurrency={user?.baseCurrency as CurrencyCode}
          onSelectCurrency={handleCurrencyChange}
          onDismiss={() => setCurrencyModalOpen(false)}
        />
      </Modal>
    </AppScreen>
  );
};

type UserCardProps = {
  user: User;
  theme: ThemeType;
  style?: StyleProp<ViewStyle>;
  onEditProfile?: () => void;
};

const UserCard: React.FC<UserCardProps> = ({
  user,
  theme,
  style,
  onEditProfile,
}) => {
  return (
    <Pressable onPress={onEditProfile}>
      <AppCard
        padding={20}
        style={[
          {
            // boxShadow: `0px 0px 12px ${theme.colors.primary}`
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 0,
                blurRadius: 15,
                spreadDistance: 0,
                color: theme.colors.primary,
                inset: true,
              },
            ],
          },
          style,
        ]}
      >
        <View style={{ position: 'relative' }}>
          <AppIconButton
            name="edit"
            color={colors.white}
            buttonStyle={[styles.editBtn]}
            onPress={() => onEditProfile?.()}
          />

          <Row mainAxisAlignment="space-between">
            <Column>
              <AppText fontSize={theme.fontSize.xLarge}>{user.name}</AppText>
              <AppText fontSize={theme.fontSize.xSmall} color={colors.grey}>
                {user.email}
              </AppText>
            </Column>

            <ProfilePicture imageUrl={user.picture} />
          </Row>
        </View>
      </AppCard>
    </Pressable>
  );
};

const WalletsCard: React.FC<{
  wallets: Wallet[];
  theme: ThemeType;
  style?: StyleProp<ViewStyle>;
}> = ({ wallets, theme, style }) => {
  return (
    <AppCard
      padding={20}
      style={[
        {
          // boxShadow: `0px 0px 12px ${theme.colors.primary}`
          // boxShadow: [
          //   {
          //     offsetX: 0,
          //     offsetY: 0,
          //     blurRadius: 7,
          //     spreadDistance: 0,
          //     color: theme.colors.primary,
          //     inset: false,
          //   },
          // ],
        },
        style,
      ]}
    >
      <Column>
        <AppText
          fontWeight={'bold'}
          fontSize={theme.fontSize.large}
          style={{ marginStart: 10, marginBottom: 10 }}
        >
          Cards
        </AppText>
        <FlatList
          scrollEnabled={false}
          data={wallets}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <WalletCard wallet={item} style={{ margin: 10 }} />
          )}
        />
      </Column>
    </AppCard>
  );
};

const WalletCard: React.FC<{
  wallet: Wallet;
  style?: StyleProp<ViewStyle>;
}> = ({ wallet, style }) => {
  return (
    <Column crossAxisAlignment="center" spacing={10} style={[style]}>
      <AppCard padding={20} backgroundColor={colors.dark}>
        <WalletIconRenderer iconKey={wallet.type} size={40} />
      </AppCard>

      <AppText>{wallet.name}</AppText>
    </Column>
  );
};

const CategoriesCard: React.FC<{
  categories: Category[];
  theme: ThemeType;
  style?: StyleProp<ViewStyle>;
}> = ({ categories, theme, style }) => {
  const navigation = useNavigation<AppNavigation>();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('categories');
      }}
    >
      <AppCard
        // padding={20}
        style={[
          {
            // boxShadow: `0px 0px 12px ${theme.colors.primary}`
            // boxShadow: [
            //   {
            //     offsetX: 0,
            //     offsetY: 0,
            //     blurRadius: 7,
            //     spreadDistance: 0,
            //     color: theme.colors.primary,
            //     inset: false,
            //   },
            // ],
          },
          style,
        ]}
      >
        <View>
          <AppText
            style={[
              styles.seeMoreText,
              {
                color: theme.colors.primary,
              },
            ]}
          >
            See More &gt;
          </AppText>

          <Column style={{ padding: 20 }}>
            <AppText
              fontWeight={'bold'}
              fontSize={theme.fontSize.large}
              style={{ marginStart: 10, marginBottom: 10 }}
            >
              Categories
            </AppText>
            <FlatList
              scrollEnabled={false}
              data={categories}
              numColumns={2}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <CategoryCard category={item} style={{ margin: 10 }} />
              )}
            />
          </Column>
        </View>
      </AppCard>
    </Pressable>
  );
};

const CategoryCard: React.FC<{
  category: Category;
  style?: StyleProp<ViewStyle>;
}> = ({ category, style }) => {
  const categoryColor = getCategoryColor(category.color);
  return (
    <Column crossAxisAlignment="center" spacing={10} style={[style]}>
      <AppCard padding={20} backgroundColor={categoryColor + '20'}>
        <CategoryIconRenderer
          icon={category.icon}
          size={40}
          color={categoryColor}
        />
      </AppCard>

      <AppText>{category.name}</AppText>
    </Column>
  );
};

const EditProfileModal: React.FC<{
  user: User;
  theme: ThemeType;
  onDismiss: () => void;
}> = ({ user, theme, onDismiss }) => {
  const showSnackbar = useSnackbarStore(s => s.showSnackbar);
  const setuser = userStore(s => s.setUser);
  const formikRef = useRef<FormikProps<UpdateProfilePayload>>(null);
  const [imageUri, setImage] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const updateProfile = async (payload: UpdateProfilePayload) => {
    setLoading(true);

    const res = await updateProfileService(payload);

    if (res.success) {
      setuser(res.data);
      setLoading(false);

      formikRef.current?.resetForm();
      showSnackbar(res.message, { type: 'success' });

      onDismiss(); // Dismiss the Modal
    } else {
      showSnackbar(res.message, { type: 'error' });
      setLoading(false);
    }
  };

  return (
    <View style={[styles.modalOverlay]}>
      <View
        style={[
          styles.moadlContainer,
          {
            backgroundColor: theme.colors.secondaryBackground,
            borderRadius: theme.radius.md,
          },
        ]}
      >
        <AppText
          fontSize={theme.fontSize.xLarge}
          style={{
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 30,
          }}
        >
          Update Profile
        </AppText>

        <Formik<UpdateProfilePayload>
          innerRef={formikRef}
          initialValues={{
            name: user.name,
            picture: undefined,
          }}
          onSubmit={(values, { setFieldError }) => {
            const hasNameChanged = values.name !== user.name;
            const hasNewPicture = values.picture !== undefined;

            if (!hasNameChanged && !hasNewPicture) {
              setFieldError(
                'name',
                'Please change your name or upload a new photo to save.',
              );
              return;
            }

            const payload: Partial<UpdateProfilePayload> = {};

            if (hasNameChanged) payload.name = values.name;
            if (hasNewPicture) payload.picture = values.picture;

            updateProfile(payload);
          }}
        >
          {({ submitCount, handleSubmit, setFieldValue }) => (
            <View>
              <UploadPicture
                mode="gallery"
                imageUrl={imageUri ?? user.picture}
                onUpload={image => {
                  const newUri = image.uri || null;

                  setImage(newUri);
                  setFieldValue('picture', newUri);
                }}
                style={{
                  alignSelf: 'center',
                  margin: 20,
                }}
              />

              <Column spacing={5} style={{ marginTop: 10, marginBottom: 10 }}>
                <AppText>Name</AppText>
                <AppFormInput
                  name="name"
                  validator={value => {
                    if (isNullOrEmpty(value)) {
                      return "name can't be empty!";
                    }

                    return undefined;
                  }}
                  submitCount={submitCount}
                  placeholder="Name"
                />
              </Column>

              <Column
                spacing={10}
                style={{
                  marginTop: 30,
                }}
              >
                <AppButton onPress={handleSubmit} fullWidth>
                  {isLoading ? (
                    <AppActivityLoader size={'small'} color={colors.white} />
                  ) : (
                    'Save'
                  )}
                </AppButton>

                <AppButton
                  onPress={onDismiss}
                  backgroundColor={colors.black}
                  foregroundColor={colors.white}
                >
                  Cancel
                </AppButton>
              </Column>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  editBtn: {
    backgroundColor: colors.green,
    position: 'absolute',
    overflow: 'visible',
    bottom: -35,
    left: -30,
    zIndex: 1,
  },
  seeMoreText: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  userCard: {
    margin: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // Centers vertically
    alignItems: 'center', // Centers horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  },
  moadlContainer: {
    width: '90%',
    padding: 20,
  },
});

export default ProfileScreen;
