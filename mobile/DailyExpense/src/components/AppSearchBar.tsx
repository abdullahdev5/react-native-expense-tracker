import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { colors } from '@/theme/colors';
import { SearchBar } from 'react-native-screens';
import AppButton from './Button';

type AppSerachBarProps = {
    onSearch?: (text: string) => void;
    onTextChange?: (text: string) => void;
}

const AppSearchBar = (props: AppSerachBarProps) => {
  const [text, setText] = useState('');
  return (
    <View style={styles.container}>
        <TextInput
            placeholder='Search Transactions here...'
            value={text}
            style={styles.inputField}
            inputMode='search'
            onChangeText={(text) => {
                setText(text)
                props?.onTextChange && props.onTextChange(text);
            }}
            onEndEditing={() => props.onSearch && props.onSearch(text)}
        />

        <AppButton
            buttonStyle={styles.seachBtn}
            onPress={() => props.onSearch && props.onSearch(text)}
        >Search</AppButton>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    inputField: {
        backgroundColor: colors.grey,
        borderRadius: 20,
        padding: 10,
        flex: 2,
    },
    seachBtn: {
        borderRadius: 5,
        flex: 1,
    }
})

export default AppSearchBar