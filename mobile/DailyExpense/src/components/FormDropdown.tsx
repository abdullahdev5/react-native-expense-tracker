import { View, Text } from 'react-native'
import React from 'react'
import AppTextInput from './TextInput';
import { useField } from 'formik';
import DropdownComponent, { DropdownItem } from './Dropdown';
import AppText from './Text';
import { useTheme } from '../theme/ThemeProvider';


type FormDropdownComponentProps<V> = {
    name: string;
    submitCount: number;
    validator: (value: string | null | undefined) => string | undefined;

    onChange?: (item: DropdownItem<V>) => void;
} & Omit<
    React.ComponentProps<typeof DropdownComponent<V>>,
    'onChange'
>;


function FormDropdownComponent<V>({ name, submitCount, validator, onChange, ...props }: FormDropdownComponentProps<V>) {

  const [field, meta, helpers] = useField<string | null>({
    name,
    validate: validator
  });

  const error = meta.error && (meta.touched || submitCount > 0)
    ? meta.error 
    : undefined
  const { theme } = useTheme();
  const hasError = !!error;


  return (
    <View>
      <DropdownComponent<V>
        {...props}
        value={field.value ?? null}
        onFocus={() => {
          helpers.setTouched(true);
          props.onFocus?.();
        }}
        onChange={(item: DropdownItem<V>) => {
            helpers.setValue(item.value);
            onChange?.(item);
        }}
      />

      {hasError && (
        <AppText fontSize={theme.fontSize.xSmall} color={theme.colors.error}>
          {error}
        </AppText>
      )}
    </View>
  )
}

export default FormDropdownComponent