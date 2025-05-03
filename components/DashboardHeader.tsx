import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';

interface DashboardHeaderProps {
  totalCustomers: number;
  totalBottlesDelivered: number;
  totalRevenue: number;
}

export default function DashboardHeader({
  totalCustomers,
  totalBottlesDelivered,
  totalRevenue,
}: DashboardHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.leftSection}>
          <Appbar.Content 
            title="MEKONG" 
            titleStyle={styles.brandTitle}
          />
        </View>
        <View style={styles.rightSection}>
          <Appbar.Action icon="bell" onPress={() => {}} />
          <Appbar.Action icon="account" onPress={() => {}} />
        </View>
      </Appbar.Header>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="titleLarge" style={styles.statNumber}>{totalCustomers}</Text>
          <Text variant="bodyMedium">Khách hàng</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="titleLarge" style={styles.statNumber}>{totalBottlesDelivered}</Text>
          <Text variant="bodyMedium">Bình đã giao</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="titleLarge" style={styles.statNumber}>{totalRevenue.toLocaleString()}đ</Text>
          <Text variant="bodyMedium">Doanh thu</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    elevation: 0,
    backgroundColor: '#fff',
    height: 60,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
}); 