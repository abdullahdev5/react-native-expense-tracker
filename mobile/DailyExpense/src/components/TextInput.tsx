import {
  View,
  Text,
  TextInputProps,
  TextInput,
  KeyboardType,
  StyleSheet,
  ViewStyle,
  ColorValue,
  TextInputEndEditingEvent,
  StyleProp,
  FocusEvent,
  BlurEvent,
  Platform,
} from 'react-native';
import React, { forwardRef, ReactNode, useMemo, useState } from 'react';
import { Column, Row } from './Layout';
import { useTheme } from '../theme/ThemeProvider';
import { TextInputBorder } from '../types/styles';
import AppText from './Text';
import { colors } from '../theme/colors';

type AppTextInputProps = Omit<TextInputProps, 'style'> & {
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardType;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  error?: string;
  errorTextColor?: string;
  helperText?: string;
  titleOuter?: string;
  textColor?: ColorValue;
  filled?: boolean;
  fillColor?: ColorValue;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  border?: TextInputBorder;
  focussedBorderColor?: ColorValue;
  unfocussedBorderColor?: ColorValue;
  onEndEditting?: (e: TextInputEndEditingEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onFocus?: (e: BlurEvent) => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
};

const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
  (
    {
      value,
      defaultValue,
      onChangeText,
      placeholder,
      placeholderTextColor = colors.grey,
      error,
      errorTextColor,
      helperText,
      titleOuter,
      textColor = colors.white,
      keyboardType = 'default',
      filled = true,
      fillColor = colors.lightDark,
      prefixIcon,
      suffixIcon,
      border = 'outlined',
      focussedBorderColor,
      unfocussedBorderColor,
      onEndEditing,
      onBlur,
      onFocus,
      containerStyle,
      inputContainerStyle,
      inputStyle,

      ...props
    },
    ref,
  ) => {
    const [isFocussed, setIsFocussed] = useState(false);

    const { theme } = useTheme();
    const isOutlined = border === 'outlined';
    const isUnderlined = border === 'underlined';
    const hasError = !!error;

    const containerStyleInternal: ViewStyle = {
      borderWidth: isOutlined ? 1 : 0,
      ...(isUnderlined && { borderBottomWidth: 1 }),
      borderColor: hasError
        ? errorTextColor ?? theme.colors.error
        : isFocussed
        ? focussedBorderColor ?? theme.colors.primary
        : unfocussedBorderColor ?? theme.colors.inputBorder,
      borderRadius: isOutlined ? theme.radius.sm : 0,
      backgroundColor: filled ? fillColor : undefined,
      paddingHorizontal: 10,
    };

    const shadowStyle = useMemo(
      () =>
        Platform.select({
          ios: {
            shadowColor: focussedBorderColor ?? theme.colors.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isFocussed && isOutlined ? 0.6 : 0,
            shadowRadius: isFocussed && isOutlined ? 8 : 0,
          },
          android: {
            shadowColor: focussedBorderColor ?? theme.colors.primary,
            elevation: isFocussed && isOutlined ? 10 : 0,
          },
        }) as ViewStyle,
      [isFocussed, focussedBorderColor],
    );

    const inputStyleInternal: ViewStyle = {
      flex: 1,
      minHeight: 50,
      paddingHorizontal: 5,
    };

    return (
      <Column style={containerStyle} fullWidth>
        {titleOuter && (
          <AppText fontWeight="bold" style={{ marginBottom: 5 }}>
            {titleOuter}
          </AppText>
        )}
        <Row
          style={[containerStyleInternal, shadowStyle, inputContainerStyle]}
          spacing={5}
          fullWidth
        >
          {/* prefixIcon */}
          {prefixIcon && prefixIcon}
          <TextInput
            {...props}
            ref={ref}

            style={[inputStyleInternal, { color: textColor }, inputStyle]}
            value={value}
            defaultValue={defaultValue}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            keyboardType={keyboardType}
            onEndEditing={onEndEditing}
            onFocus={e => {
              setIsFocussed(true);
              if (onFocus) onFocus(e);
            }}
            onBlur={e => {
              setIsFocussed(false);
              if (onBlur) onBlur(e);
            }}
          />
          {/* suffixIcon */}
          {suffixIcon && suffixIcon}
        </Row>
        {/* helper text */}
        {helperText && (
          <AppText
            style={{ paddingStart: 10 }}
            color={errorTextColor ?? theme.colors.info}
            fontSize={theme.fontSize.xSmall}
          >
            {helperText}
          </AppText>
        )}
        {/* error */}
        {hasError && (
          <AppText
            style={{ paddingStart: 10 }}
            color={errorTextColor ?? theme.colors.error}
            fontSize={theme.fontSize.xSmall}
          >
            {error}
          </AppText>
        )}
      </Column>
    );
  },
);

// const AppTextInput = ({
//   value,
//   defaultValue,
//   onChangeText,
//   placeholder,
//   placeholderTextColor = colors.grey,
//   error,
//   errorTextColor,
//   helperText,
//   titleOuter,
//   textColor = colors.white,
//   keyboardType = 'default',
//   filled = true,
//   fillColor = colors.lightDark,
//   prefixIcon,
//   suffixIcon,
//   border = 'outlined',
//   focussedBorderColor,
//   unfocussedBorderColor,
//   onEndEditing,
//   onBlur,
//   onFocus,
//   containerStyle,
//   inputContainerStyle,
//   inputStyle,
// }: AppTextInputProps) => {
//   const [isFocussed, setIsFocussed] = useState(false);

//   const { theme } = useTheme();
//   const isOutlined = border === 'outlined';
//   const isUnderlined = border === 'underlined';
//   const hasError = !!error;

//   const containerStyleInternal: ViewStyle = {
//     borderWidth: isOutlined ? 1 : 0,
//     ...(isUnderlined && { borderBottomWidth: 1 }),
//     borderColor: hasError
//       ? errorTextColor ?? theme.colors.error
//       : isFocussed
//       ? focussedBorderColor ?? theme.colors.primary
//       : unfocussedBorderColor ?? theme.colors.inputBorder,
//     borderRadius: isOutlined ? theme.radius.sm : 0,
//     backgroundColor: filled ? fillColor : undefined,
//     paddingHorizontal: 10,
//   };

//   const shadowStyle = useMemo(
//     () =>
//       Platform.select({
//         ios: {
//           shadowColor: focussedBorderColor ?? theme.colors.primary,
//           shadowOffset: { width: 0, height: 0 },
//           shadowOpacity: (isFocussed && isOutlined) ? 0.6 : 0,
//           shadowRadius: (isFocussed && isOutlined) ? 8 : 0,
//         },
//         android: {
//           shadowColor: focussedBorderColor ?? theme.colors.primary,
//           elevation: (isFocussed && isOutlined) ? 10 : 0,
//         },
//       }) as ViewStyle,
//     [isFocussed, focussedBorderColor],
//   );

//   const inputStyleInternal: ViewStyle = {
//     flex: 1,
//     minHeight: 50,
//     paddingHorizontal: 5,
//   };

//   return (
//     <Column style={containerStyle} fullWidth>
//       {titleOuter && (
//         <AppText fontWeight="bold" style={{ marginBottom: 5 }}>
//           {titleOuter}
//         </AppText>
//       )}
//       <Row
//         style={[containerStyleInternal, shadowStyle, inputContainerStyle]}
//         spacing={5}
//         fullWidth
//       >
//         {/* prefixIcon */}
//         {prefixIcon && prefixIcon}
//         <TextInput
//           style={[inputStyleInternal, { color: textColor }, inputStyle]}
//           value={value}
//           defaultValue={defaultValue}
//           onChangeText={onChangeText}
//           placeholder={placeholder}
//           placeholderTextColor={placeholderTextColor}
//           keyboardType={keyboardType}
//           onEndEditing={onEndEditing}
//           onFocus={e => {
//             setIsFocussed(true);
//             if (onFocus) onFocus(e);
//           }}
//           onBlur={e => {
//             setIsFocussed(false);
//             if (onBlur) onBlur(e);
//           }}
//         />
//         {/* suffixIcon */}
//         {suffixIcon && suffixIcon}
//       </Row>
//       {/* helper text */}
//       {helperText && (
//         <AppText
//           style={{ paddingStart: 10 }}
//           color={errorTextColor ?? theme.colors.info}
//           fontSize={theme.fontSize.xSmall}
//         >
//           {helperText}
//         </AppText>
//       )}
//       {/* error */}
//       {hasError && (
//         <AppText
//           style={{ paddingStart: 10 }}
//           color={errorTextColor ?? theme.colors.error}
//           fontSize={theme.fontSize.xSmall}
//         >
//           {error}
//         </AppText>
//       )}
//     </Column>
//   );
// };

export default AppTextInput;
