import { View, Text } from 'react-native';
import React from 'react';
import { DropdownItem } from '@components/Dropdown';
import { CategoryColor, CategoryIcon } from '../../../types/category';
import { useTheme } from '../../../theme/ThemeProvider';
import { Column, Row } from '@components/Layout';
import AppText from '@components/Text';
import { colors } from '../../../theme/colors';
import CategoryIconRenderer from './CategoryIconRenderer';
import { getCategoryColor } from '../../../utils/category.utils';
import AppIcon from '@components/Icon';

type CategoryColorsDropdownItemProps = {
  item: DropdownItem<CategoryColor>;
  selected: boolean | undefined;
};

const CategoryColorsDropdownItem = ({
  item,
  selected,
}: CategoryColorsDropdownItemProps) => {
  const { theme } = useTheme();

  return (
    <Column
      crossAxisAlignment="flex-start"
      style={{
        padding: 10,
        borderBottomWidth: selected ? 1 : 0,
        borderBottomColor: theme.colors.outline,
      }}
    >
      {selected && (
        <AppText
          color={colors.grey}
          fontSize={theme.fontSize.xSmall}
          style={{ paddingBottom: 5 }}
        >
          selected:
        </AppText>
      )}

      <Row spacing={20}>
        {item.icon && (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: getCategoryColor(item.icon as CategoryColor),
              }}
            />
        )}
        <AppText>{item.label}</AppText>
      </Row>
    </Column>
  );
};

export default CategoryColorsDropdownItem;
