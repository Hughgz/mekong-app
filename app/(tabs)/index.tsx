import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, IconButton, Surface, Text, useTheme } from 'react-native-paper';
import DashboardHeader from '../../components/DashboardHeader';
import { supabase } from '../../services/supabase';
import { Customer } from '../../types/customer';

export default function DashboardScreen() {
  const theme = useTheme();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalBottlesDelivered = customers.reduce((sum, customer) => sum + customer.total_bottles_delivered, 0);
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.total_amount, 0);

  return (
    <View style={styles.container}>
      <DashboardHeader
        totalCustomers={customers.length}
        totalBottlesDelivered={totalBottlesDelivered}
        totalRevenue={totalRevenue}
      />
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Surface style={styles.statsContainer} elevation={1}>
          <View style={styles.statsRow}>
            <Card style={styles.statCard} mode="elevated">
              <Card.Content style={styles.statCardContent}>
                <View style={styles.statIconContainer}>
                  <IconButton 
                    icon="account-group" 
                    size={24} 
                    iconColor="#1976D2" 
                    style={styles.statIcon}
                  />
                </View>
                <View style={styles.statInfo}>
                  <Text variant="bodyMedium" style={styles.statLabel}>Tổng số khách hàng</Text>
                  <Text variant="headlineMedium" style={styles.statValue}>
                    {customers.length}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.statCard} mode="elevated">
              <Card.Content style={styles.statCardContent}>
                <View style={styles.statIconContainer}>
                  <IconButton 
                    icon="water" 
                    size={24} 
                    iconColor="#1976D2" 
                    style={styles.statIcon}
                  />
                </View>
                <View style={styles.statInfo}>
                  <Text variant="bodyMedium" style={styles.statLabel}>Tổng số bình đã giao</Text>
                  <Text variant="headlineMedium" style={styles.statValue}>
                    {totalBottlesDelivered}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>

          <View style={styles.statsRow}>
            <Card style={styles.statCard} mode="elevated">
              <Card.Content style={styles.statCardContent}>
                <View style={styles.statIconContainer}>
                  <IconButton 
                    icon="cash" 
                    size={24} 
                    iconColor="#1976D2" 
                    style={styles.statIcon}
                  />
                </View>
                <View style={styles.statInfo}>
                  <Text variant="bodyMedium" style={styles.statLabel}>Tổng doanh thu</Text>
                  <Text variant="headlineMedium" style={styles.statValue}>
                    {totalRevenue.toLocaleString()}đ
                  </Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.statCard} mode="elevated">
              <Card.Content style={styles.statCardContent}>
                <View style={styles.statIconContainer}>
                  <IconButton 
                    icon="chart-line" 
                    size={24} 
                    iconColor="#1976D2" 
                    style={styles.statIcon}
                  />
                </View>
                <View style={styles.statInfo}>
                  <Text variant="bodyMedium" style={styles.statLabel}>Doanh thu trung bình</Text>
                  <Text variant="headlineMedium" style={styles.statValue}>
                    {customers.length > 0 
                      ? (totalRevenue / customers.length).toLocaleString() 
                      : '0'}đ
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>
        </Surface>

        <Surface style={styles.recentCustomers} elevation={1}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Khách hàng gần đây</Text>
          {customers.slice(0, 5).map((customer) => (
            <Card key={customer.id} style={styles.customerCard} mode="elevated">
              <Card.Content style={styles.customerContent}>
                <View style={styles.customerInfo}>
                  <Text variant="titleMedium" style={styles.customerName}>
                    {customer.name}
                  </Text>
                  <Text variant="bodyMedium" style={styles.customerPhone}>
                    {customer.phone}
                  </Text>
                </View>
                <View style={styles.customerStats}>
                  <Text variant="bodyMedium" style={styles.customerStat}>
                    Đã giao: {customer.total_bottles_delivered}
                  </Text>
                  <Text variant="bodyMedium" style={styles.customerStat}>
                    Tổng tiền: {customer.total_amount.toLocaleString()}đ
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  statsContainer: {
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#E3F2FD',
  },
  statIcon: {
    margin: 0,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
  },
  statValue: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 12,
  },
  recentCustomers: {
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
  },
  sectionTitle: {
    marginBottom: 12,
    color: '#1976D2',
    fontSize: 14,
    fontWeight: 'bold',
  },
  customerCard: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  customerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#1976D2',
  },
  customerPhone: {
    color: '#666',
    fontSize: 12,
  },
  customerStats: {
    alignItems: 'flex-end',
  },
  customerStat: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
});
