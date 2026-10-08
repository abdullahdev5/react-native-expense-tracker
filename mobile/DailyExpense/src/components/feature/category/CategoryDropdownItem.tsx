import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { DropdownItem } from '@components/Dropdown'
import { Category } from '../../../types/category'
import { Column, Row } from '@components/Layout'
import AppText from '@components/Text'
import { useTheme } from '../../../theme/ThemeProvider'
import { getCategoryColor } from '../../../utils/category.utils'
import CategoryIconRenderer from './CategoryIconRenderer'
import { colors } from '../../../theme/colors'

type CategoryDropdownItemProps = {
    item: DropdownItem<Category>;
    selected?: boolean | undefined;
}

const CategoryDropdownItem = ({ item, selected }: CategoryDropdownItemProps) => {
  const { theme } = useTheme();
  return (
    <Column
        style={{
            padding: 10
        }}
    >
        <Row spacing={10}>
            <View style={[styles.iconContainer, {
                backgroundColor: getCategoryColor(item.data.color)
            }]}>
                <CategoryIconRenderer icon={item.data.icon} color={colors.black} />
            </View>

            <AppText>{item.label}</AppText>
        </Row>

        {/* ALL CATEGORIES TEXT */}
        { selected && (
            <AppText color={colors.lightGrey} style={{ paddingTop: 15 }}>ALL CATEGORIES</AppText>
        )}
    </Column>
  )
};

const styles = StyleSheet.create({
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center'
    },
})

export default CategoryDropdownItem