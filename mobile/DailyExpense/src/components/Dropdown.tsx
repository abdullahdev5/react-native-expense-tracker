import { DropdownProps } from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';
import AppText from './Text';
import { Dropdown } from 'react-native-element-dropdown';
import { useTheme } from '../theme/ThemeProvider';
import React, { useMemo } from 'react';
import { colors } from '../theme/colors';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { TextInputBorder } from '../types/styles';

export type DropdownItem<T> = {
  label: string;
  value: string | null;
  icon?: string | null;
  data: T;
};

type DropdownComponentProps<V> = Omit<
  DropdownProps<DropdownItem<V>>,
  'labelField' | 'valueField' | 'value' | 'onChange'
> & {
  label?: string;
  sortData?: boolean;
  labelTextStyle?: TextStyle;
  border?: TextInputBorder;
  showSelectedTextInTop?: boolean;

  value?: string | null;
  onChange: (item: DropdownItem<V>) => void;

  renderLeftSelectedIcon?: (item: DropdownItem<V>) => React.ReactElement | null;
};

function DropdownComponent<V>({
  data,
  value,
  onChange,

  backgroundColor,
  style,
  placeholderStyle,
  selectedTextStyle,
  containerStyle,
  inputSearchStyle,
  maxHeight = 300,
  showsVerticalScrollIndicator = true,
  mode = 'default',
  activeColor = colors.transparent,
  searchPlaceholder="Search",
  renderItem,
  renderLeftIcon,
  renderLeftSelectedIcon,

  label,
  border = 'outlined',
  labelTextStyle,
  sortData = true,
  showSelectedTextInTop = true,

  ...props
}: DropdownComponentProps<V>) {
  const { theme } = useTheme();
  const isOutlined = border === 'outlined';
  const isUnderlined = border === 'underlined';

  const sortedData = useMemo(() => {
    if (!sortData || !value) return data;

    const selected = data.find(item => item.value === value);
    const rest = data.filter(item => item.value !== value);

    return selected ? [selected, ...rest] : data;
  }, [data, value, sortData]);

  const internalRenderItem = (
    item: DropdownItem<V>,
    selected: boolean | undefined,
  ) => {
    const isReadllySelected = selected && value !== null && value !== undefined;

    if (renderItem) {
      return renderItem(item, isReadllySelected);
    }

    return (
      <View
        style={{
          borderBottomWidth: selected ? 1 : 0,
          borderBottomColor: theme.colors.outline,
          padding: 10,
        }}
      >
        {(isReadllySelected && showSelectedTextInTop) && (
          <AppText color={colors.grey} fontSize={theme.fontSize.xSmall}>
            selected:
          </AppText>
        )}
        <AppText color={selected ? theme.colors.primary : theme.colors.text}>{item.label}</AppText>
      </View>
    );
  };

  return (
    <View>
      {label && (
        <AppText fontSize={theme.fontSize.small} style={labelTextStyle}>
          {label}
        </AppText>
      )}

      <Dropdown
        style={[
          {
            height: 50,
            paddingHorizontal: 10,
            // Use specific borders instead of the shorthand borderWidth
            borderTopWidth: isOutlined ? 1 : 0,
            borderLeftWidth: isOutlined ? 1 : 0,
            borderRightWidth: isOutlined ? 1 : 0,
            borderBottomWidth: isOutlined || isUnderlined ? 1 : 0,

            borderColor: theme.colors.inputBorder,
            borderRadius: isOutlined ? theme.radius.sm : 0,
            backgroundColor: backgroundColor ?? colors.transparent,
          },
          style,
        ]}
        containerStyle={[
          {
            backgroundColor: backgroundColor ?? theme.colors.background,
            borderRadius: theme.radius.sm,
            borderWidth: 1,
            borderColor: theme.colors.inputBorder,
          },
          containerStyle,
        ]}
        placeholderStyle={[
          {
            color: theme.colors.text,
          },
          placeholderStyle,
        ]}
        selectedTextStyle={[
          {
            color: theme.colors.text,
            paddingLeft: 10,
          },
          selectedTextStyle,
        ]}
        inputSearchStyle={[
          {
            borderRadius: theme.radius.sm,
            color: theme.colors.text,
          },
          inputSearchStyle
        ]}
        searchPlaceholder={searchPlaceholder}
        maxHeight={maxHeight}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        mode={mode}
        data={sortData ? sortedData : data}
        value={value}
        onChange={onChange}
        labelField={'label'}
        valueField={'value'}
        activeColor={activeColor ?? colors.transparent}
        renderItem={(item, selected) => internalRenderItem(item, selected)}
        renderLeftIcon={visible => {
          const selectedItem = data.find(item => item.value === value && value !== null && value !== undefined);

          if (selectedItem && renderLeftSelectedIcon) {
            return renderLeftSelectedIcon(selectedItem);
          }

          return renderLeftIcon ? renderLeftIcon(visible) : null;
        }}
        {...props}
      />
    </View>
  );
}

export default DropdownComponent;
