import { View, Text } from 'react-native';
import React from 'react';
import { DropdownItem } from '@components/Dropdown';
import { CategoryIcon } from '../../../types/category';
import { useTheme } from '../../../theme/ThemeProvider';
import { Column, Row } from '@components/Layout';
import AppText from '@components/Text';
import { colors } from '../../../theme/colors';
import CategoryIconRenderer from './CategoryIconRenderer';

type CategoryIconsDropdownItemProps = {
  item: DropdownItem<CategoryIcon>;
  selected: boolean | undefined;
};

const CategoryIconsDropdownItem = ({
  item,
  selected,
}: CategoryIconsDropdownItemProps) => {
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
        {item.icon && <CategoryIconRenderer icon={item.icon as CategoryIcon} />}
        <AppText>{item.label}</AppText>
      </Row>
    </Column>
  );
};

export default CategoryIconsDropdownItem;
