import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  TextStyle,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import AppScreen from '@components/AppScreen';
import AppBar from '@components/AppBar';
import AppButton, { AppIconButton } from '@components/Button';
import { Column, Row } from '@components/Layout';
import { capitalize, isNullOrEmpty } from '../../utils/string';
import { useTheme } from '../../theme/ThemeProvider';
import {
  CreateTransactionFormValues,
  CreateTransactionPayload,
  TransactionType,
  TransactionTypes,
} from '../../types/transaction';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { Formik, FormikFormProps, FormikProps } from 'formik';
import AppCard from '@components/Card';
import AppText from '@components/Text';
import AppFormInput from '@components/FormInput';
import AppIcon from '@components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Category } from '../../types/category';
import { useSnackbarStore } from '../../store/snackbarStore';
import FormDropdownComponent from '@components/FormDropdown';
import { DropdownItem } from '@components/Dropdown';
import CategoryDropdownItem from '@components/feature/category/CategoryDropdownItem';
import { Wallet } from '../../types/wallet';
import { getWalletsService } from '../../services/wallet.service';
import WalletDropdownItem from '@components/feature/wallet/WalletDropdownItem';
import AppTextInput from '@components/TextInput';
import { getCurrencySymbol } from '../../utils/currency';
import { toFormattedDateTime } from '../../utils/date';
import DatePicker from 'react-native-date-picker';
import { createTransactionLocallyAndSync } from '../../services/transaction.service';
import { useNavigation } from '@react-navigation/native';
import { AppNavigation } from '../../navigation/types';
import AppFAB from '@components/FAB';
import AppActivityLoader from '@components/Loader';
import { ThemeType } from '../../theme';
import { useWalletStore } from '../../store/useWalletStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { useTransactionStore } from '../../store/useTransactionStore';

const AddTransactionScreen = () => {
  const { theme } = useTheme();
  const formikRef = useRef<FormikProps<CreateTransactionFormValues>>(null);
  const showSnackbar = useSnackbarStore(s => s.showSnackbar);
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');

  // Wallet
  const fetchWallets = useWalletStore(s => s.fetchWallets);
  const walletsDisplay = useWalletStore(s => s.wallets);
  const isWalletsDisplayLoading = useWalletStore(s => s.isLoading);
  const [selectedWallet, setWallet] = useState<Wallet | null>(null);

  // Category
  const fetchAllCategories = useCategoryStore(s => s.fetchCategories);
  const categories = useCategoryStore(s => s.categories);
  const incomeCategories = useCategoryStore(s => s.getIncomeCategories);
  const expenseCategories = useCategoryStore(s => s.getExpenseCategories);

  const categoriesDisplay = useMemo(
    () =>
      selectedType === 'income' ? incomeCategories() : expenseCategories(),
    [selectedType, categories, incomeCategories, expenseCategories],
  );
  const isCategoriesDisplayLoading = useCategoryStore(s => s.isLoading);

  const navigation = useNavigation<AppNavigation>();
  const inputsRef = useRef<
    Partial<Record<keyof CreateTransactionFormValues, TextInput | null>>
  >({});

  const types = Object.values(TransactionTypes);
  const insets = useSafeAreaInsets();

  const [isDateTimePickerOpen, setDateTimePickerOpen] =
    useState<boolean>(false);
  const [selectedDate, setDate] = useState<Date>(new Date());
  const [displayDateString, setDisplayDateString] = useState<string>('');
  const [isCreateTransactionLoading, setCreateTransactionLoading] =
    useState<boolean>(false);

  const categoriesError = useCategoryStore(s => s.error);
  const walletsError = useWalletStore(s => s.error);

  const isDataLoading = useMemo(
    () => isCategoriesDisplayLoading || isWalletsDisplayLoading,
    [isCategoriesDisplayLoading, isWalletsDisplayLoading],
  );
  const hasError = useMemo(
    () => categoriesError || walletsError,
    [categoriesError, walletsError],
  );

  const errorDisplay = useMemo(() => {
    if (!hasError) return undefined;

    if (categoriesError) {
      return categoriesError;
    } else if (walletsError) {
      return walletsError;
    }
  }, [hasError, categoriesError, walletsError]);

  const isFormReady = useMemo(
    () =>
      categoriesDisplay &&
      walletsDisplay.length !== 0 &&
      !isCategoriesDisplayLoading &&
      !isWalletsDisplayLoading,
    [
      categoriesDisplay,
      walletsDisplay,
      isCategoriesDisplayLoading,
      isWalletsDisplayLoading,
    ],
  );

  // 1. Create a shared value that switches to 1 when data is not loading and has no error
  const isLoadedAnimated = useSharedValue(0);

  useEffect(() => {
    // If data is ready (either finished loading now OR already present on mount)
    if (!isDataLoading && !hasError && isFormReady) {
      isLoadedAnimated.value = withTiming(1, { duration: 500 });
    } else {
      isLoadedAnimated.value = 0; // Reset if state reverts
    }
  }, [isDataLoading, hasError, isFormReady]);

  // 2. Define the animated styles for Card 1 and Card 2
  const card1AnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: isLoadedAnimated.value,
      transform: [
        {
          translateY: interpolate(isLoadedAnimated.value, [0, 1], [20, 0]),
        },
      ],
    };
  });

  const card2AnimatedStyle = useAnimatedStyle(() => {
    // Staggering Card 2 slightly by interpolating its start point further down the animation timeline
    const staggeredValue = interpolate(
      isLoadedAnimated.value,
      [0, 0.2, 1],
      [0, 0, 1],
    );
    return {
      opacity: staggeredValue,
      transform: [
        {
          translateY: interpolate(staggeredValue, [0, 1], [20, 0]),
        },
      ],
    };
  });

  const categoriesDropdownData = useMemo<DropdownItem<Category>[]>(() => {
    if (!categoriesDisplay || categoriesDisplay.length === 0) {
      return [];
    }

    return categoriesDisplay?.map(c => ({
      label: c.name,
      value: c.id,
      data: c,
    }));
  }, [categoriesDisplay]);

  const walletsDropdownData = useMemo<DropdownItem<Wallet>[]>(() => {
    if (!walletsDisplay || walletsDisplay.length === 0) {
      return [];
    }

    return walletsDisplay.map(w => ({
      label: w.name,
      value: w.id,
      data: w,
    }));
  }, [walletsDisplay]);

  const walletDetailsAnimatedStyle = useAnimatedStyle(() => {
    const duration = 300;
    return {
      transform: [
        {
          translateY: withTiming(selectedWallet != null ? 0 : -10, {
            duration,
          }),
        },
      ],
      opacity: withTiming(selectedWallet != null ? 1 : 0, { duration }),
    };
  }, [selectedWallet]);

  useEffect(() => {
    Promise.all([getCategories(), getWallets()]);
  }, []);

  useEffect(() => {
    const formattedDate = toFormattedDateTime(selectedDate, {
      format: 'h:mm a.m/p.m. | MMM dd, yyyy',
    });
    setDisplayDateString(formattedDate);
  }, [selectedDate]);

  const getCategories = async () => {
    if (categories.length > 0) return;

    try {
      await fetchAllCategories();
    } catch (e: any) {
      return showSnackbar(e.message, { type: 'error' });
    }
  };

  const getWallets = async () => {
    if (walletsDisplay.length > 0) return;

    try {
      await fetchWallets();
    } catch (e: any) {
      return showSnackbar(e.message, { type: 'error' });
    }
  };

  const createTransaction = async (data: CreateTransactionPayload) => {
    setCreateTransactionLoading(true);

    await createTransactionLocallyAndSync(data);

    setCreateTransactionLoading(false);
    showSnackbar('Your Transaction is created Successfully', {
      type: 'success',
    });
    formikRef.current?.resetForm();
    navigation.popToTop();
  };

  const moveFocusToNextInput = (key: keyof CreateTransactionFormValues) => {
    inputsRef.current[key]?.focus();
  };

  return (
    <AppScreen>
      <AppBar
        leading={
          <AppIconButton name="close" onPress={() => navigation.pop()} />
        }
      />

      {isDataLoading ? (
        <AppActivityLoader style={{ alignSelf: 'center' }} />
      ) : hasError ? (
        <AppText
          fontSize={theme.fontSize.large}
          color={theme.colors.error}
          style={{
            alignSelf: 'center',
            textAlign: 'center',
          }}
        >
          {errorDisplay}
        </AppText>
      ) : (
        // Form

        <Formik
          innerRef={formikRef}
          initialValues={{
            date: toFormattedDateTime(selectedDate, { format: 'toISOString' }),
            title: '',
            categoryId: '',
            walletId: '',
            amount: '',
            type: selectedType,
            merchantName: '',
          }}
          onSubmit={async values => {
            const payload: CreateTransactionPayload = {
              ...values,
              amount: parseFloat(values.amount) || 0,
            };

            await createTransaction(payload);
          }}
        >
          {({ handleSubmit, submitCount, setFieldValue, isValid }) => {
            return (
              <Column style={{ flex: 1 }}>
                {/* Types Buttons */}
                <Row mainAxisAlignment="space-evenly" style={{ padding: 10 }}>
                  {types.map(type => {
                    const isSelected = type === selectedType;

                    return (
                      <TransactionTypeButton
                        key={type}
                        type={type}
                        theme={theme}
                        isSelected={isSelected}
                        onPress={() => {
                          if (
                            type === selectedType ||
                            isCategoriesDisplayLoading
                          ) {
                            return;
                          }

                          setSelectedType(type);
                          setFieldValue('type', type);

                          setFieldValue('categoryId', '');

                          console.log(`Selected Type: ${selectedType}`);
                        }}
                      />
                    );
                  })}
                </Row>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{
                    paddingBottom: insets.bottom + 40,
                    flexGrow: 1,
                  }}
                >
                  <Column spacing={10} style={{ padding: 20 }}>
                    <Animated.View style={[card1AnimatedStyle]}>
                      <AddTransactionCard style={{ gap: 30 }}>
                        {/* Date */}
                        <Pressable
                          onPress={() => {
                            setDateTimePickerOpen(true);
                          }}
                        >
                          <LabeledInput
                            label="TRANSACTION"
                            style={{
                              pointerEvents: 'none',
                            }}
                          >
                            <AppTextInput
                              editable={false}
                              focusable={false}
                              showSoftInputOnFocus={false}
                              pointerEvents="none"
                              value={displayDateString}
                              inputContainerStyle={{ paddingHorizontal: 0 }}
                              inputStyle={{ paddingStart: 0 }}
                              border="underlined"
                              unfocussedBorderColor={theme.colors.outline}
                              filled={false}
                            />
                          </LabeledInput>
                        </Pressable>

                        <LabeledInput label="AMOUNT">
                          <AppFormInput
                            ref={el => {
                              inputsRef.current['amount'] = el;
                            }}
                            inputContainerStyle={{ paddingHorizontal: 0 }}
                            inputStyle={{ paddingStart: 0 }}
                            prefixIcon={
                              <AppText>
                                {selectedWallet
                                  ? getCurrencySymbol(selectedWallet.currency)
                                  : ''}
                              </AppText>
                            }
                            name="amount"
                            submitCount={submitCount}
                            validator={value => {
                              const errorMessage = 'please enter valid Amount!';

                              const amount = Number(value);

                              if (
                                isNullOrEmpty(value) ||
                                Number.isNaN(amount)
                              ) {
                                return errorMessage;
                              }

                              if (amount <= 0) {
                                return errorMessage;
                              }

                              return undefined;
                            }}
                            placeholder="0"
                            border="underlined"
                            keyboardType="decimal-pad"
                            unfocussedBorderColor={theme.colors.outline}
                            filled={false}
                            returnKeyType="next"
                            submitBehavior="submit"
                            onSubmitEditing={() =>
                              moveFocusToNextInput('merchantName')
                            }
                          />
                        </LabeledInput>
                      </AddTransactionCard>
                    </Animated.View>

                    <Animated.View style={[card2AnimatedStyle]}>
                      <AddTransactionCard style={{ gap: 30 }}>
                        {/* Category */}
                        <LabeledInput label="CATEGORY">
                          <FormDropdownComponent
                            style={{
                              paddingHorizontal: 0,
                              borderBottomColor: theme.colors.outline,
                            }}
                            selectedTextStyle={{ paddingLeft: 0 }}
                            name="categoryId"
                            submitCount={submitCount}
                            validator={value => {
                              if (isNullOrEmpty(value)) {
                                return 'Category is Required!';
                              }
                              return undefined;
                            }}
                            placeholder="please select Category"
                            data={categoriesDropdownData}
                            renderItem={(item, selected) => (
                              <CategoryDropdownItem
                                item={item}
                                selected={selected}
                              />
                            )}
                            border="underlined"
                          />
                        </LabeledInput>

                        {/* Wallet */}
                        <LabeledInput label="WALLET">
                          <FormDropdownComponent
                            style={{
                              paddingHorizontal: 0,
                              borderBottomColor: theme.colors.outline,
                            }}
                            selectedTextStyle={{ paddingLeft: 0 }}
                            name="walletId"
                            submitCount={submitCount}
                            validator={value => {
                              if (isNullOrEmpty(value)) {
                                return 'Wallet is required!';
                              }
                              return undefined;
                            }}
                            placeholder="please select your Wallet"
                            data={walletsDropdownData}
                            renderItem={(item, selected) => (
                              <WalletDropdownItem
                                item={item}
                                selected={selected}
                              />
                            )}
                            border="underlined"
                            onChange={item => {
                              setWallet(item.data);
                            }}
                          />
                        </LabeledInput>

                        {/* Merchant Name */}
                        <LabeledInput label="MERCHANT NAME">
                          <AppFormInput
                            ref={el => {
                              inputsRef.current['merchantName'] = el;
                            }}
                            inputContainerStyle={{ paddingHorizontal: 0 }}
                            inputStyle={{ paddingStart: 0 }}
                            name="merchantName"
                            submitCount={submitCount}
                            validator={value => {
                              if (isNullOrEmpty(value)) {
                                return 'Merchant Name is required!';
                              }
                              return undefined;
                            }}
                            placeholder="e.g. Amazon, Starbucks"
                            border="underlined"
                            unfocussedBorderColor={theme.colors.outline}
                            filled={false}
                            returnKeyType="next"
                            submitBehavior="submit"
                            onSubmitEditing={() =>
                              moveFocusToNextInput('title')
                            }
                          />
                        </LabeledInput>

                        <LabeledInput label="TITLE">
                          {/* Title */}
                          <AppFormInput
                            ref={el => {
                              inputsRef.current['title'] = el;
                            }}
                            inputContainerStyle={{ paddingHorizontal: 0 }}
                            inputStyle={{ paddingStart: 0 }}
                            name="title"
                            submitCount={submitCount}
                            validator={value => {
                              if (isNullOrEmpty(value)) {
                                return 'Title is required!';
                              }
                              return undefined;
                            }}
                            placeholder="(required)"
                            border="underlined"
                            filled={false}
                            unfocussedBorderColor={theme.colors.outline}
                          />
                        </LabeledInput>

                        {/* Description */}
                        <LabeledInput label="DESCRIPTION">
                          <AppFormInput
                            inputContainerStyle={{ paddingHorizontal: 0 }}
                            inputStyle={{ paddingStart: 0 }}
                            name="description"
                            submitCount={submitCount}
                            validator={() => undefined}
                            placeholder="(Optional)"
                            border="underlined"
                            filled={false}
                            unfocussedBorderColor={theme.colors.outline}
                          />
                        </LabeledInput>

                        {/* Wallet Details */}
                        {selectedWallet != null && (
                          <Animated.View
                            style={[
                              walletDetailsAnimatedStyle,
                              {
                                flexDirection: 'column',
                                gap: 20,
                              },
                            ]}
                          >
                            {/* Currency */}
                            <LabeledInput
                              label="CURRENCY"
                              style={{ pointerEvents: 'none' }}
                            >
                              <AppTextInput
                                editable={false}
                                focusable={false}
                                showSoftInputOnFocus={false}
                                placeholder={`${
                                  selectedWallet?.currency
                                } (${getCurrencySymbol(
                                  selectedWallet.currency,
                                )})`}
                                inputContainerStyle={{ paddingHorizontal: 0 }}
                                inputStyle={{ paddingStart: 0 }}
                                border="underlined"
                                filled={false}
                                unfocussedBorderColor={theme.colors.outline}
                              />
                            </LabeledInput>

                            {/* Payment Method */}
                            <LabeledInput
                              label="PAYMENT METHOD"
                              style={{ pointerEvents: 'none' }}
                            >
                              <AppTextInput
                                editable={false}
                                focusable={false}
                                showSoftInputOnFocus={false}
                                placeholder={capitalize(selectedWallet.type)}
                                inputContainerStyle={{ paddingHorizontal: 0 }}
                                inputStyle={{ paddingStart: 0 }}
                                border="underlined"
                                filled={false}
                                unfocussedBorderColor={theme.colors.outline}
                              />
                            </LabeledInput>
                          </Animated.View>
                        )}
                      </AddTransactionCard>
                    </Animated.View>
                  </Column>
                </ScrollView>

                <DatePicker
                  style={{ zIndex: 999 }}
                  modal
                  date={selectedDate}
                  mode="datetime"
                  open={isDateTimePickerOpen}
                  onCancel={() => {
                    setDateTimePickerOpen(false);
                  }}
                  onConfirm={date => {
                    const formattedDateString = toFormattedDateTime(date, {
                      format: 'toISOString',
                    });
                    setFieldValue('date', formattedDateString);
                    setDate(date);
                    setDateTimePickerOpen(false);
                  }}
                />

                <AppFAB
                  onPress={() => {
                    if (!isFormReady || !isValid)
                      return showSnackbar('Please wait for data to load!', {
                        type: 'info',
                      });

                    handleSubmit();
                  }}
                >
                  {isCreateTransactionLoading ? (
                    <AppActivityLoader size={'small'} color={colors.white} />
                  ) : (
                    <AppIcon name="add" />
                  )}
                </AppFAB>
              </Column>
            );
          }}
        </Formik>
      )}
    </AppScreen>
  );
};

type AddTransactionCardProps = {
  children: ReactNode;
  padding?: number;
  margin?: number;
  style?: StyleProp<ViewStyle>;
};
const AddTransactionCard = ({
  padding = 20,
  ...props
}: AddTransactionCardProps) => {
  return (
    <AppCard padding={padding} margin={props.margin} style={props.style}>
      {props.children}
    </AppCard>
  );
};

type LabeledInputProps = {
  children: ReactNode;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};

const LabeledInput = ({
  children,
  label,
  labelStyle,
  style,
}: LabeledInputProps) => {
  const { theme } = useTheme();
  return (
    <Column spacing={10} style={style}>
      {label && (
        <AppText style={[{ color: 'rgba(255,255,255,0.6)' }, labelStyle]}>
          {label}
        </AppText>
      )}

      {children}
    </Column>
  );
};

type TransactionTypeButtonProps = {
  type: TransactionType;
  isSelected?: boolean;
  onPress: () => void;
  theme: ThemeType;
};
const TransactionTypeButton = ({
  type,
  isSelected,
  onPress,
  theme,
}: TransactionTypeButtonProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    flex: withSpring(isSelected ? 1.6 : 1, { damping: 70 }),
  }));

  return (
    <Animated.View style={[animatedStyle, { marginHorizontal: 4 }]}>
      <AppButton
        backgroundColor={
          isSelected ? theme.colors.primary : theme.colors.secondary
        }
        borderRadius={theme.radius.md} // Give it a slight roundness for a modern look
        onPress={onPress}
        textStyle={{ color: isSelected ? colors.white : colors.lightGrey }}
      >
        {capitalize(type)}
      </AppButton>
    </Animated.View>
  );
};

export default AddTransactionScreen;
