// screens/profile/CategoriesScreen.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { FlatList, View, Pressable, StyleSheet } from 'react-native';
import AppScreen from '@components/AppScreen';
import AppBar from '@components/AppBar';
import AppText from '@components/Text';
import AppCard from '@components/Card';
import { Column, Row } from '@components/Layout';
import { useTheme } from '../../theme/ThemeProvider';
import { useCategoryStore } from '../../store/useCategoryStore';
import { Category } from '../../types/category';
import CategoryIconRenderer from '@components/feature/category/CategoryIconRenderer';
import { getCategoryColor } from '../../utils/category.utils';
import { colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { AppNavigation } from '../../navigation/types';
import AppFAB from '@components/FAB';
import AppIcon from '@components/Icon';
import { capitalize } from '../../utils/string';
import { TransactionTypes } from '../../types/transaction';
import { AppIconButton } from '@components/Button';
import { useDialogStore } from '../../store/useDialogStore';
import { useSnackbarStore } from '../../store/snackbarStore';
import { deleteCategoryService } from '../../services/category.service';
import Animated, { LinearTransition } from 'react-native-reanimated';

// const CategoriesScreen = () => {
//   const { theme } = useTheme();
//   const navigation = useNavigation<AppNavigation>();
//   const categories = useCategoryStore(s => s.categories);
//   const [activeType, setActiveType] = useState<'expense' | 'income'>('expense');

//   // Compute sorted & filtered categories on the fly
//   const processedCategories = useMemo(() => {
//     return categories
//       .filter(cat => cat.type === activeType)
//       .sort((a, b) => {
//         // Sort Custom categories (isDefault === false) to the top, defaults below
//         const aVal = a.isDefault ? 1 : 0;
//         const bVal = b.isDefault ? 1 : 0;
//         return aVal - bVal;
//       });
//   }, [categories, activeType]);

//   const renderCategoryItem = ({ item }: { item: Category }) => {
//     const iconColor = getCategoryColor(item.color);

//     return (
//       <AppCard padding={15} style={styles.card} backgroundColor={colors.dark}>
//         <Row
//           crossAxisAlignment="center"
//           mainAxisAlignment="space-between"
//           style={{ flex: 1 }}
//         >
//           <Row crossAxisAlignment="center" spacing={15} style={{ flex: 1, marginRight: 10 }}>
//             {/* Styled Circular Icon Container */}
//             <View
//               style={[
//                 styles.iconContainer,
//                 { backgroundColor: iconColor + '20' },
//               ]}
//             >
//               <CategoryIconRenderer
//                 icon={item.icon}
//                 size={24}
//                 color={iconColor}
//               />
//             </View>
//             <Column>
//               <AppText
//                 fontWeight="600"
//                 fontSize={theme.fontSize.medium}
//                 numberOfLines={1}
//               >
//                 {capitalize(item.name)}
//               </AppText>
//               <AppText
//                 fontSize={12}
//                 color={colors.grey}
//                 style={{ marginTop: 2 }}
//               >
//                 {item.type.toUpperCase()}
//               </AppText>
//             </Column>
//           </Row>

//           <Row spacing={5}>
//             {/* Badge Displaying Origin Status */}
//             <View
//               style={[
//                 styles.badge,
//                 {
//                   backgroundColor: item.isDefault
//                     ? 'rgba(255,255,255,0.08)'
//                     : theme.colors.primary + '15',
//                 },
//               ]}
//             >
//               <AppText
//                 fontSize={10}
//                 fontWeight="bold"
//                 color={item.isDefault ? colors.grey : theme.colors.primary}
//               >
//                 {item.isDefault ? 'System' : 'Custom'}
//               </AppText>
//             </View>

//             <AppIconButton
//               name="delete"
//               onPress={() => {}}
//               color={colors.white}
//               size={15}
//               buttonStyle={{
//                 backgroundColor: colors.red,
//               }}
//             />
//           </Row>
//         </Row>
//       </AppCard>
//     );
//   };

//   return (
//     <AppScreen>
//       <AppBar title="Categories" showBackButton={true} />

//       {/* Underlined Segment Switcher */}
//       <Row style={styles.tabContainer}>
//         {Object.values(TransactionTypes).map(type => {
//           const isActive = activeType === type;
//           return (
//             <Pressable
//               key={type}
//               onPress={() => setActiveType(type)}
//               style={[
//                 styles.tabButton,
//                 isActive && {
//                   borderBottomColor: theme.colors.primary,
//                   borderBottomWidth: 2,
//                 },
//               ]}
//             >
//               <AppText
//                 fontWeight={isActive ? 'bold' : 'normal'}
//                 color={isActive ? theme.colors.primary : colors.grey}
//                 fontSize={theme.fontSize.medium}
//               >
//                 {type.charAt(0).toUpperCase() + type.slice(1)}
//               </AppText>
//             </Pressable>
//           );
//         })}
//       </Row>

//       {/* Grid of Clean Categories Cards */}
//       <FlatList
//         data={processedCategories}
//         keyExtractor={item => item.id}
//         renderItem={renderCategoryItem}
//         contentContainerStyle={styles.listContent}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <AppText color={colors.grey}>No categories found</AppText>
//           </View>
//         }
//       />

//       <AppFAB
//         onPress={() => {
//           navigation.navigate('add_category');
//         }}
//       >
//         <AppIcon name="add" />
//       </AppFAB>
//     </AppScreen>
//   );
// };

// const styles = StyleSheet.create({
//   tabContainer: {
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.05)',
//     marginBottom: 10,
//   },
//   tabButton: {
//     flex: 1,
//     alignItems: 'center',
//     paddingVertical: 15,
//   },
//   listContent: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   card: {
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.03)',
//   },
//   iconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   badge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 12,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 100,
//   },
// });

const CategoriesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<AppNavigation>();
  const categories = useCategoryStore(s => s.categories);
  const deleteCategoryFromState = useCategoryStore(s => s.deleteCategory);
  const showDialog = useDialogStore(s => s.showDialog);
  const showSnackbar = useSnackbarStore(s => s.showSnackbar);

  const [activeType, setActiveType] = useState<'expense' | 'income'>('expense');

  // Compute sorted & filtered categories on the fly
  const processedCategories = useMemo(() => {
    return categories
      .filter(cat => cat.type === activeType)
      .sort((a, b) => {
        // Sort Custom categories (isDefault === false) to the top, defaults below
        const aVal = a.isDefault ? 1 : 0;
        const bVal = b.isDefault ? 1 : 0;
        return aVal - bVal;
      });
  }, [categories, activeType]);

  // Memoized render item using your global colors constant
  const renderCategoryItem = useCallback(
    ({ item }: { item: Category }) => {
      const iconColor = getCategoryColor(item.color);

      const deleteCategory = async (id: string) => {
        try {
          await deleteCategoryService(id);

          deleteCategoryFromState(id);
          showSnackbar(`\"${item.name}\" categoty is deleted Successfully`, {
            type: 'success',
          });
        } catch (e: any) {
          showSnackbar(e.message, { type: 'error' });
        }
      };

      const onDeletePress = () => {
        showDialog(
          `Are you sure you want to delete the "${capitalize(
            item.name,
          )}" category?`,
          {
            title: 'Delete Category',
            confirmText: 'Delete',
            isDestructive: true,
            onConfirm: async () => {
              await deleteCategory(item.id);
            },
          },
        );
      };

      return (
        <AppCard padding={15} style={styles.card} backgroundColor={colors.dark}>
          <Row
            crossAxisAlignment="center"
            mainAxisAlignment="space-between"
            style={{ width: '100%' }}
          >
            {/* Left Section: Icon and Text Details with strict layout bounds */}
            <Row
              crossAxisAlignment="center"
              spacing={15}
              style={{ flex: 1, marginRight: 10 }}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${iconColor}20` },
                ]}
              >
                <CategoryIconRenderer
                  icon={item.icon}
                  size={24}
                  color={iconColor}
                />
              </View>

              {/* flexShrink restricts the text block from pushing actions out of bounds */}
              <Column style={{ flexShrink: 1 }}>
                <AppText
                  fontWeight="600"
                  fontSize={theme.fontSize.medium}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {capitalize(item.name)}
                </AppText>

                <AppText
                  fontSize={12}
                  color={colors.grey}
                  style={{ marginTop: 2 }}
                >
                  {item.type.toUpperCase()}
                </AppText>
              </Column>
            </Row>

            {/* Right Section: Badges and Actions */}
            <Row crossAxisAlignment="center" spacing={10}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: item.isDefault
                      ? 'rgba(255,255,255,0.08)'
                      : `${theme.colors.primary}15`,
                  },
                ]}
              >
                <AppText
                  fontSize={10}
                  fontWeight="bold"
                  color={item.isDefault ? colors.grey : theme.colors.primary}
                >
                  {item.isDefault ? 'System' : 'Custom'}
                </AppText>
              </View>

              <AppIconButton
                name="delete"
                onPress={onDeletePress}
                color={colors.white}
                size={15}
                buttonStyle={{
                  backgroundColor: colors.red,
                }}
              />
            </Row>
          </Row>
        </AppCard>
      );
    },
    [theme],
  );

  return (
    <AppScreen>
      <AppBar title="Categories" showBackButton={true} />

      {/* Underlined Segment Switcher */}
      <Row style={styles.tabContainer}>
        {Object.values(TransactionTypes).map(type => {
          const isActive = activeType === type;
          return (
            <Pressable
              key={type}
              onPress={() => setActiveType(type)}
              style={[
                styles.tabButton,
                isActive && {
                  borderBottomColor: theme.colors.primary,
                  borderBottomWidth: 2,
                },
              ]}
            >
              <AppText
                fontWeight={isActive ? 'bold' : 'normal'}
                color={isActive ? theme.colors.primary : colors.grey}
                fontSize={theme.fontSize.medium}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </AppText>
            </Pressable>
          );
        })}
      </Row>

      {/* Grid of Clean Categories Cards */}
      <Animated.FlatList
        data={processedCategories}
        keyExtractor={item => item.id}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.listContent}
        itemLayoutAnimation={LinearTransition}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppText color={colors.grey}>No categories found</AppText>
          </View>
        }
      />

      <AppFAB
        onPress={() => {
          navigation.navigate('add_category');
        }}
      >
        <AppIcon name="add" />
      </AppFAB>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
});

export default CategoriesScreen;
