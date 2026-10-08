import { View, FlexStyle, StyleProp, ViewStyle } from 'react-native';
import React, { Children, ReactNode } from 'react';
import { JustifyContent, AlignItems, FlexDirection } from '../types/styles';

type LayoutProps = {
  children?: ReactNode;
  mainAxisAlignment?: JustifyContent;
  crossAxisAlignment?: AlignItems;
  spacing?: number;
  expand?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  center?: boolean;
  style?: StyleProp<ViewStyle>;
};

const Flex = ({
  direction,
  mainAxisAlignment = 'flex-start',
  crossAxisAlignment = 'stretch',
  expand,
  fullWidth,
  fullHeight,
  center,
  ...props
}: LayoutProps & { direction: FlexDirection }) => {
  const isRow = direction === 'row';

  return (
    <View
      style={[
        {
          flexDirection: direction,
          justifyContent: mainAxisAlignment,
          alignItems: crossAxisAlignment,
          gap: props.spacing,
          // expand
          ...(expand && { flex: 1 }),

          // cross axis control
          ...(fullWidth && !isRow && { width: '100%' }),
          ...(fullWidth && isRow && { alignSelf: 'stretch' }),

          ...(fullHeight && isRow && { height: '100%' }),
          ...(fullHeight && !isRow && { alignSelf: 'stretch' }),

          // center
          ...(center && { justifyContent: 'center', alignItems: 'center' })
        },
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
};

// Column
export const Column = (props: LayoutProps) => (
  <Flex direction="column" {...props} />
);

// Row
export const Row = (props: LayoutProps) => (
  <Flex direction="row" crossAxisAlignment="center" {...props} />
);
