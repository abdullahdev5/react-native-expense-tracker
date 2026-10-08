import { View, Text, ScrollView } from 'react-native';
import React, { JSX, useEffect, useMemo, useRef, useState } from 'react';
import AppScreen from '../../../components/AppScreen';
import AppText from '../../../components/Text';
import AppBar from '../../../components/AppBar';
import AppCard from '@components/Card';
import { Column, Row } from '@components/Layout';
import AppIcon from '@components/Icon';
import { useTheme } from '../../../theme/ThemeProvider';
import AppFormInput from '@components/FormInput';
import { Formik, FormikProps, useFormikContext } from 'formik';
import {
  AllWalletProviders,
  AllWalletTypesAndProviders,
  CreateWalletPayload,
  WalletType,
} from '../../../types/wallet';
import {
  walletCardProviders,
  walletDigitalProviders,
  walletTypes,
} from '../../../constants/walletConstants';
import AddWalletDropdownItem from '@components/feature/wallet/AddWalletDropdownItem';
import FormDropdownComponent from '@components/FormDropdown';
import { isNullOrEmpty } from '../../../utils/string';
import WalletIconRenderer from '@components/feature/wallet/WalletIconRenderer';
import { currenciesDropdownData } from '../../../constants/currencies';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AppButton from '@components/Button';
import { useSnackbarStore } from '../../../store/snackbarStore';
import { createWalletService } from '../../../services/wallet.service';
import AppActivityLoader from '@components/Loader';
import { colors } from '../../../theme/colors';
import { useWalletStore } from '../../../store/useWalletStore';
import WalletStack from '@components/feature/wallet/WalletStack';
import { useDashboardStore } from '../../../store/useDashboardStore';
import { fontSize } from '../../../theme/typography';
import BalanceComponent from '@components/feature/wallet/BalanceComponent';

const WalletScreen = () => {
  const { theme } = useTheme();
  const showSnackbar = useSnackbarStore(s => s.showSnackbar);
  const fetchWallets = useWalletStore(s => s.fetchWallets);
  const walletsDisplay = useWalletStore(s => s.wallets);
  const errorOnFetch = useWalletStore(s => s.error);
  const totalBalance = useDashboardStore((s) => s.data?.totalBalance ?? 0);
  const baseCurrency = useDashboardStore((s) => s.data?.baseCurrency ?? 'PKR');
  const isWalletsDisplayLoading = useWalletStore(s => s.isLoading);

  useEffect(() => {
    getWallets();
  }, []);

  const getWallets = async () => {
    if (walletsDisplay.length > 0) return;

    try {
      await fetchWallets();
    } catch (e: any) {
      return showSnackbar(e.message, { type: 'error' });
    }
  };

  return (
    <AppScreen>
      <AppBar title="Wallet" showBackButton={false} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {isWalletsDisplayLoading && (
          <AppActivityLoader style={{ alignSelf: 'center' }} />
        )}

        {walletsDisplay.length === 0 && (
          <AppText
            color={theme.colors.primary}
            style={{
              alignSelf: 'center',
              textAlign: 'center',
            }}
          >
            You have No Wallets!
          </AppText>
        )}

        {errorOnFetch != null && (
          <AppText
            color={theme.colors.error}
            style={{
              alignSelf: 'center',
              textAlign: 'center',
            }}
          >
            {errorOnFetch}
          </AppText>
        )}

        {walletsDisplay.length !== 0 && (
          <WalletStack wallets={walletsDisplay} />
        )}

        <View style={{
          padding: 20,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <BalanceComponent
            balance={totalBalance}
            currency={baseCurrency}
          />
          <AppText
            color={colors.grey}
            fontSize={theme.fontSize.small}
          >Available balance</AppText>
        </View>

        {/* Create Wallet Card */}
        <AddWalletForm />
      </ScrollView>
    </AppScreen>
  );
};

const AddWalletForm = (): React.JSX.Element => {
  const showSnackbar = useSnackbarStore(s => s.showSnackbar);

  const [isCreateWalletLoading, setCreateWalletLoading] =
    useState<boolean>(false);
  const formikRef = useRef<FormikProps<CreateWalletPayload>>(null);

  const addWalletToStoreIfNotExists = useWalletStore(s => s.addWalletIfNotExists);

  const createWallet = async (values: CreateWalletPayload) => {
    setCreateWalletLoading(true);

    try {
      const wallet = await createWalletService(values);

      if (wallet) {
        addWalletToStoreIfNotExists(wallet);
      }

      formikRef.current?.resetForm(); // Resetting Form

      return showSnackbar('Your Wallet is created Successfully', { type: 'success' });
    } catch (e: any) {
      return showSnackbar(e.message, { type: 'error' });
    } finally {
      setCreateWalletLoading(false);
    }
  };

  return (
    <Formik<CreateWalletPayload>
      innerRef={formikRef}
      initialValues={{
        name: '',
        type: 'cash',
        provider: null,
        currency: 'PKR',
      }}
      onSubmit={async values => {
        console.log(`Add Wallet Values: ${JSON.stringify(values)}`);
        await createWallet(values);
      }}
    >
      {({ handleSubmit, submitCount }) => (
        <AddWalletFormContent
          handleSubmit={handleSubmit}
          submitCount={submitCount}
          isCreateWalletLoading={isCreateWalletLoading}
        />
      )}
    </Formik>
  );
};

type AddWalletFormProps = {
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  submitCount: number;
  isCreateWalletLoading: boolean;
};
const AddWalletFormContent = ({
  handleSubmit,
  submitCount,
  isCreateWalletLoading,
}: AddWalletFormProps) => {
  const { values, setFieldValue } = useFormikContext<CreateWalletPayload>();
  const { theme } = useTheme();

  useEffect(() => {
    if (values.type !== 'card' && values.type !== 'digital') {
      setFieldValue('provider', null);
    }
  }, [values.type, setFieldValue]);

  const walletProvidersData = useMemo(() => {
    switch (values.type) {
      case 'card':
        return walletCardProviders;
      case 'digital':
        return walletDigitalProviders;
      default:
        return [];
    }
  }, [values.type]);

  const showWalletProvider =
    values.type === 'card' || values.type === 'digital';

  // Wallet Provider Dropdown Animated values
  const animatedOPacity = useSharedValue(0);
  const animatedTranslateY = useSharedValue(-10);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animatedOPacity.value,
    transform: [{ translateY: animatedTranslateY.value }],
    overflow: 'hidden',
    padding: 0,
    margin: 0,
  }));

  const duration = 500;
  useEffect(() => {
    animatedOPacity.value = withTiming(showWalletProvider ? 1 : 0, {
      duration,
    });
    animatedTranslateY.value = withTiming(showWalletProvider ? 0 : -10, {
      duration,
      easing: Easing.out(Easing.ease),
    });
  }, [showWalletProvider]);

  return (
    <AppCard margin={20} padding={20}>
      <Row spacing={5} crossAxisAlignment="flex-start">
        <AppIcon
          name="add"
          color={theme.colors.primary}
          size={theme.fontSize.xLarge}
        />
        <Column>
          <AppText color={theme.colors.primary} fontSize={theme.fontSize.large}>
            Add Wallet
          </AppText>

          <AppText fontSize={theme.fontSize.small}>create your wallet</AppText>
        </Column>
      </Row>

      <Column spacing={10} style={{ paddingTop: 30 }}>
        <AppFormInput
          placeholder="Wallet Name"
          name="name"
          submitCount={submitCount}
          validator={value => {
            if (value.trim().length === 0) {
              return 'Wallet Name is required!';
            }
            return undefined;
          }}
        />

        <FormDropdownComponent<WalletType>
          name={'type'}
          submitCount={submitCount}
          validator={value => {
            if (isNullOrEmpty(value)) {
              return 'Wallet Type is Required!';
            }
            return undefined;
          }}
          data={walletTypes}
          placeholder="Select Wallet Type"
          renderItem={(item, selected) => (
            <AddWalletDropdownItem item={item} selected={selected} />
          )}
          renderLeftSelectedIcon={item =>
            item.icon ? (
              <WalletIconRenderer
                iconKey={item.icon as AllWalletTypesAndProviders}
              />
            ) : null
          }
        />

        {showWalletProvider && (
          <Animated.View
            style={animatedStyle}
            // entering={SlideInDown}
            // exiting={SlideOutUp}
          >
            <FormDropdownComponent<AllWalletProviders>
              name="provider"
              submitCount={submitCount}
              validator={value => {
                if (!showWalletProvider) return undefined;

                if (isNullOrEmpty(value)) {
                  return 'Wallet Provider is Required!';
                }
                return undefined;
              }}
              data={walletProvidersData}
              placeholder={'select the provider'}
              renderItem={(item, selected) => (
                <AddWalletDropdownItem item={item} selected={selected} />
              )}
              renderLeftSelectedIcon={item =>
                item.icon ? (
                  <WalletIconRenderer
                    iconKey={item.icon as AllWalletTypesAndProviders}
                  />
                ) : null
              }
            />
          </Animated.View>
        )}

        <FormDropdownComponent
          name="currency"
          submitCount={submitCount}
          validator={value => {
            if (isNullOrEmpty(value)) {
              return 'Currency is Required!';
            }
            return undefined;
          }}
          data={currenciesDropdownData}
          placeholder="select the currency"
          search={true}
        />

        <AppButton onPress={handleSubmit}>
          {isCreateWalletLoading ? (
            <AppActivityLoader size={'small'} color={colors.white} />
          ) : (
            <Row spacing={5}>
              <AppIcon name='add' />
              <AppText color={colors.white}>Create</AppText>
            </Row>
          )}
        </AppButton>
      </Column>
    </AppCard>
  );
};

export default WalletScreen;
