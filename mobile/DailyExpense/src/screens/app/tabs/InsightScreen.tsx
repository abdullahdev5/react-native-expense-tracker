import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import AppScreen from '../../../components/AppScreen';
import AppBar from '../../../components/AppBar';
import AppText from '../../../components/Text';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
} from '@react-navigation/material-top-tabs';
import { useTheme } from '../../../theme/ThemeProvider';
import { capitalize } from '../../../utils/string';
import { Column, Row } from '@components/Layout';
import { getCurrencySymbol } from '../../../utils/currency';
import AppActivityLoader from '@components/Loader';
import AppButton from '@components/Button';
import { colors } from '../../../theme/colors';
import { InsightsPeriod, InsightsPeriods } from '../../../types/insight';
import { TransactionType, TransactionTypes } from '../../../types/transaction';
import { useInsightsStore } from '../../../store/useInsightsStore';
import InsightChart from '@components/feature/insight/InsightChart';
import CustomInsightChart from '../../../components/feature/insight/InsightChart';

const InsightScreen = () => {
  const { theme } = useTheme();

  const [selectedPeriod, setSelectedPeriod] = useState<InsightsPeriod>('daily');
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');

  const cache = useInsightsStore(s => s.cache);
  const isInsightsLoading = useInsightsStore(s => s.isLoading);

  const { insightsSummary, chartData } = useMemo(() => {
    const cacheKey = `${selectedPeriod}_${selectedType}`;
    const cacheData = cache[cacheKey];

    return {
      insightsSummary: cacheData?.summary ?? null,
      chartData: cacheData?.chartData ?? []
    };
  }, [cache, selectedPeriod, selectedType]);

  const fetchStats = useInsightsStore(s => s.fetchInsights);

  // const currentPeriod = useInsightsStore((s) => s.currentperiod);
  // const currentType = useInsightsStore((s) => s.currentType);

  const availablePeriods = Object.values(InsightsPeriods);
  const availableTypes = Object.values(TransactionTypes);

  // const getStats = async (period: InsightsPeriod, type: TransactionType) => fetchStats(period, type);

  useEffect(() => {
    fetchStats({ period: selectedPeriod, type: selectedType });
  }, [selectedPeriod, selectedType]);

  return (
    <AppScreen>
      <AppBar title="Insight" showBackButton={false} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Column>
          <Row
            mainAxisAlignment="space-evenly"
            spacing={5}
            style={{
              paddingTop: 30,
            }}
          >
            {availablePeriods.map((period, index) => (
              <AppButton
                key={index}
                width={100}
                onPress={() => {
                  if (period === selectedPeriod) return;
                  setSelectedPeriod(period);
                }}
                backgroundColor={
                  period !== selectedPeriod ? colors.transparent : undefined
                }
              >
                {capitalize(period)}
              </AppButton>
            ))}
          </Row>

          <View
            style={{
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isInsightsLoading && (
              <AppActivityLoader
                style={{
                  padding: 20,
                }}
              />
            )}
          </View>

          <Column
            spacing={5}
            style={{
              paddingTop: 50,
              paddingBottom: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AppText
              color={theme.colors.primary}
              fontSize={theme.fontSize.medium}
            >
              {insightsSummary?.label ?? ''}
            </AppText>
            <AppText fontSize={theme.fontSize.xLarge}>
              {getCurrencySymbol(insightsSummary?.baseCurrency)}
              {(insightsSummary?.totalAmount ?? 0).toLocaleString()}
            </AppText>
          </Column>

          {/* Type Selector */}
          <Row
            style={{
              marginHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255,255,255,0.1)',
            }}
          >
            {availableTypes.map(type => {
              const isActive = selectedType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setSelectedType(type)}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: 15,
                    // The yellow underline
                    borderBottomWidth: isActive ? 2 : 0,
                    borderBottomColor: theme.colors.primary,
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 16,
                      fontWeight: isActive ? '600' : '400',
                      color: isActive ? theme.colors.primary : '#999',
                    }}
                  >
                    {capitalize(type)}
                  </AppText>
                </Pressable>
              );
            })}
          </Row>

          {/* Chart */}
          {(chartData && chartData.length > 0) && (
            <CustomInsightChart chartData={chartData} style={{ marginTop: 0 }} />
          )}
        </Column>
      </ScrollView>
    </AppScreen>
  );
};

export default InsightScreen;
