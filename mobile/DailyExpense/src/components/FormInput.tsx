import { View, Text, TextInput } from 'react-native';
import React, { forwardRef } from 'react';
import AppTextInput from './TextInput';
import { useField } from 'formik';

type AppFormInputProps = {
  name: string;
  submitCount: number;
  validator: (value: string) => string | undefined;
} & React.ComponentProps<typeof AppTextInput>;

const AppFormInput = forwardRef<TextInput, AppFormInputProps>(
  ({ name, submitCount, validator, ...props }, ref) => {
    const [field, meta, helpers] = useField({
      name,
      validate: validator,
    });

    const handleTextChange = (text: string) => {
      if (props.onChangeText) {
        props.onChangeText(text);
      } else {
        helpers.setValue(text);
      }
    };

    const error = meta.touched || submitCount > 0 ? meta.error : undefined;

    return (
      <>
        <AppTextInput
          {...props}
          ref={ref}

          error={error}
          value={field.value ? field.value.toString() : ''}
          onChangeText={handleTextChange}
          onBlur={e => {
            helpers.setTouched(true);
            props.onBlur?.(e);
          }}
        />
      </>
    );
  },
);

// const AppFormInput = ({ name, submitCount, validator, ...props }: AppFormInputProps) => {

//   const [field, meta, helpers] = useField({
//     name,
//     validate: validator
//   });

//   const handleTextChange = (text: string) => {
//     if (props.onChangeText) {
//       props.onChangeText(text);
//     } else {
//       helpers.setValue(text);
//     }
//   };

//   const error = (meta.touched || submitCount > 0) ? meta.error : undefined

//   return (
//     <>
//       <AppTextInput
//         {...props}
//         error={error}
//         value={field.value ? field.value.toString() : ''}
//         onChangeText={handleTextChange}
//         onBlur={(e) => {
//           helpers.setTouched(true);
//           props.onBlur?.(e);
//         }}
//       />
//     </>
//   );
// }

export default AppFormInput;
