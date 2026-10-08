import { View, Text } from 'react-native';
import React, { useState } from 'react';
import AppScreen from '@components/AppScreen';
import AppText from '@components/Text';
import { useTheme } from '../theme/ThemeProvider';
import { Column } from '@components/Layout';
import AppBar from '@components/AppBar';
import FormDropdownComponent from '@components/FormDropdown';
import DropdownComponent from '@components/Dropdown';
import { currenciesDropdownData } from '../constants/currencies';
import AppButton from '@components/Button';
import { useSnackbarStore } from '../store/snackbarStore';
import { setBaseCurrencyService } from '../services/user.service';
import { useNavigation } from '@react-navigation/native';
import { userStore } from '../store/userStore';
import AppActivityLoader from '@components/Loader';
import { colors } from '../theme/colors';

const SetBaseCurrencyScreen = () => {
  const { theme } = useTheme();
  const showSnackbar = useSnackbarStore(s => s.showSnackbar);
  const setUser = userStore((s) => s.setUser);


  const [baseCurrency, setBaseCurrency] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const onConfirm = async () => {
    if (!baseCurrency) {
      return showSnackbar('please select your base currency', {
        type: 'info',
      });
    }

    setLoading(true);

    const res = await setBaseCurrencyService(baseCurrency);

    if (res.success) {
        setLoading(false);
        showSnackbar(res.message, { type: 'success' });
        
        setUser(res.data);

    } else {
        setLoading(false);
        showSnackbar(res.message, { type: 'error' });
    }
  };

  return (
    <AppScreen>
      <AppBar title="CONFIGURE" titleSize="small" />

      <Column style={{ flex: 1, padding: 20, paddingTop: 50 }}>
        <AppText fontSize={theme.fontSize.xLarge} style={{ alignSelf: 'center' }}>Base Currency</AppText>

        <AppText style={{ alignSelf: 'center' }}>What will be your main currency?</AppText>

        <DropdownComponent
          style={{ marginTop: 50 }}
          placeholder="please select base currency"
          data={currenciesDropdownData}
          search={true}
          onChange={item => {
            setBaseCurrency(item.value);
          }}
        />

        <View style={{ flex: 1 }} />

        <AppButton onPress={onConfirm}>
            {isLoading ? (
                <AppActivityLoader size={'small'} color={colors.white} />
            ) : ("Confirm")}
        </AppButton>
      </Column>
    </AppScreen>
  );
};

export default SetBaseCurrencyScreen;
