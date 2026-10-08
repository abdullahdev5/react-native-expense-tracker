import { View, Text } from 'react-native';
import React, { useRef, useState } from 'react';
import AppScreen from '@components/AppScreen';
import { Formik, FormikProps, useFormikContext } from 'formik';
import {
  CategoryColor,
  CategoryIcon,
  CreateCategoryPayload,
} from '../../types/category';
import { useTheme } from '../../theme/ThemeProvider';
import AppFormInput from '@components/FormInput';
import { Column, Row } from '@components/Layout';
import AppText from '@components/Text';
import { isNullOrEmpty } from '../../utils/string';
import FormDropdownComponent from '@components/FormDropdown';
import AppButton from '@components/Button';
import {
  categoryColorsDropdownData,
  categoryIconsDropdownData,
} from '../../constants/categoryConstants';
import CategoryIconsDropdownItem from '@components/feature/category/CategoryIconsDropdownItem';
import CategoryIconRenderer from '@components/feature/category/CategoryIconRenderer';
import CategoryColorsDropdownItem from '@components/feature/category/CategoryColorsDropdownItem';
import AppBar from '@components/AppBar';
import AppCard from '@components/Card';
import AppIcon from '@components/Icon';
import { useSnackbarStore } from '../../store/snackbarStore';
import { createCategoryService } from '../../services/category.service';
import AppActivityLoader from '@components/Loader';
import { colors } from '../../theme/colors';
import { useCategoryStore } from '../../store/useCategoryStore';

const AddCategoryScreen = () => {
  const { theme } = useTheme();

  const [isLoading, setLoading] = useState<boolean>(false);
  const showSnackbar = useSnackbarStore(s => s.showSnackbar);
  const addCategoryToStateIfNotExists = useCategoryStore(s => s.addCategoryIfNotExists);
  const formikRef = useRef<FormikProps<CreateCategoryPayload>>(null);

  const createCategory = async (data: CreateCategoryPayload) => {
    setLoading(true);

    try {
      const category = await createCategoryService(data);
      
      if (category) {
        addCategoryToStateIfNotExists(category);
      }

      formikRef.current?.resetForm(); // Resetting Form
      showSnackbar('Your Category is created Successfully', { type: 'success' });

    } catch (e: any) {
      showSnackbar(e.message, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen>
      <AppBar
        title="CATEGORY"
        titleSize="medium"
        actions={<AppIcon name="add" size={30} />}
      />

      <Formik<CreateCategoryPayload>
        innerRef={formikRef}
        initialValues={{
          name: '',
          type: 'expense',
          icon: null,
          color: '',
        }}
        onSubmit={createCategory}
      >
        {({ handleSubmit, submitCount, setFieldValue }) => {
          return (
            <AppCard margin={20} padding={20}>
              <Column
                // fullHeight
                spacing={10}
              >
                <AppText
                  fontSize={theme.fontSize.large}
                  fontWeight={'bold'}
                  color={theme.colors.primary}
                  style={{ alignSelf: 'center' }}
                >
                  ADD CATEGORY
                </AppText>

                {/* Category Name */}
                <AppFormInput
                  containerStyle={{ paddingTop: 20 }}
                  name="name"
                  submitCount={submitCount}
                  validator={value => {
                    if (isNullOrEmpty(value)) {
                      return 'Name is Required!';
                    }
                    return undefined;
                  }}
                  placeholder="Category Name"
                />

                {/* Type */}
                <FormDropdownComponent
                  name="type"
                  placeholder="Category Type"
                  data={[
                    { label: 'Expense', value: 'expense', data: 'expense' },
                    { label: 'Income', value: 'income', data: 'income' },
                  ]}
                  submitCount={submitCount}
                  validator={value => {
                    if (isNullOrEmpty(value)) {
                      return 'Type is Required!';
                    }
                    return undefined;
                  }}
                  showSelectedTextInTop={false}
                />

                {/* Icon */}
                <FormDropdownComponent<CategoryIcon>
                  name="icon"
                  placeholder="Category Icon (Optional)"
                  data={categoryIconsDropdownData}
                  submitCount={submitCount}
                  validator={() => undefined}
                  search={true}
                  renderItem={(item, selected) => (
                    <CategoryIconsDropdownItem
                      item={item}
                      selected={selected}
                    />
                  )}
                  renderLeftSelectedIcon={item => (
                    <CategoryIconRenderer icon={item.icon as CategoryIcon} />
                  )}
                />

                {/* Color */}
                <FormDropdownComponent<CategoryColor>
                  name="color"
                  placeholder="Category Color"
                  data={categoryColorsDropdownData}
                  submitCount={submitCount}
                  validator={value => {
                    if (isNullOrEmpty(value)) {
                      return 'Category Color is Required!';
                    }
                    return undefined;
                  }}
                  renderItem={(item, selected) => (
                    <CategoryColorsDropdownItem
                      item={item}
                      selected={selected}
                    />
                  )}
                  renderLeftSelectedIcon={item =>
                    item.icon ? (
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: item.icon,
                        }}
                      />
                    ) : null
                  }
                />

                <AppButton style={{ paddingTop: 20 }} onPress={handleSubmit}>
                  {isLoading ? (
                    <AppActivityLoader size={'small'} color={colors.white} />
                  ) : (
                    <Row spacing={5}>
                      <AppIcon name="add" />
                      <AppText>Create</AppText>
                    </Row>
                  )}
                </AppButton>
              </Column>
            </AppCard>
          );
        }}
      </Formik>
    </AppScreen>
  );
};

export default AddCategoryScreen;
