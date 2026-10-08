import { View, Text } from 'react-native';
import React from 'react';
import AppIcon from '@components/Icon';
import { colors } from '../../../theme/colors';
import { getCategoryIcon } from '../../../utils/category.utils';
import { CategoryIcon } from '../../../types/category';

type CategoryIconRendererProps = {
  icon?: CategoryIcon | null;
} & Omit<React.ComponentProps<typeof AppIcon>, 'name'>;

const CategoryIconRenderer = ({
  icon,
  color = colors.white,
  provider = 'Community',
  ...props
}: CategoryIconRendererProps) => {
  if (!icon) {
    return null;
  }

  return <AppIcon name={getCategoryIcon(icon)} color={color} provider={provider} {...props} />;
};

export default CategoryIconRenderer;
