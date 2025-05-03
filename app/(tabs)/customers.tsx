import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, FAB, IconButton, Text, useTheme } from 'react-native-paper';
import AppHeader from '../../components/AppHeader';
import { supabase } from '../../services/supabase';
import { Customer } from '../../types/customer';

const ITEMS_PER_PAGE = 10;

export default function CustomersScreen() {
  const theme = useTheme();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnreturnedOnly, setShowUnreturnedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error, count } = await supabase
        .from('customers')
        .select('*', { count: 'exact' })
        .order('name')
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (error) throw error;
      setCustomers(data || []);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = customer.name.toLowerCase().includes(query) ||
                         customer.phone.toLowerCase().includes(query) ||
                         customer.address.toLowerCase().includes(query);
    const matchesUnreturnedFilter = !showUnreturnedOnly || customer.total_bottles_returned === 0;
    return matchesSearch && matchesUnreturnedFilter;
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader title="Khách hàng" showSearch onSearchChange={setSearchQuery} searchQuery={searchQuery} />
        <ActivityIndicator style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader showSearch onSearchChange={setSearchQuery} searchQuery={searchQuery} />
      <View style={styles.filterContainer}>
        <Button
          mode={showUnreturnedOnly ? "contained" : "outlined"}
          onPress={() => setShowUnreturnedOnly(!showUnreturnedOnly)}
          style={styles.filterButton}
          icon="filter"
        >
          Chưa trả bình
        </Button>
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {filteredCustomers.map((customer) => (
          <Link key={customer.id} href={`/customer/${customer.id}`} asChild>
            <Card style={styles.card} mode="elevated">
              <Card.Content>
                <View style={styles.customerHeader}>
                  <Text variant="titleMedium" style={styles.customerName}>{customer.name}</Text>
                  {customer.total_bottles_returned === 0 && (
                    <IconButton
                      icon="alert"
                      size={20}
                      iconColor="#F44336"
                    />
                  )}
                </View>
                <View style={styles.customerInfo}>
                  <Text variant="bodyMedium" style={styles.infoText}>
                    <Text style={styles.label}>SĐT:</Text> {customer.phone}
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoText}>
                    <Text style={styles.label}>Địa chỉ:</Text> {customer.address}
                  </Text>
                  <Text variant="bodyMedium" style={styles.infoText}>
                    <Text style={styles.label}>Giá/bình:</Text> {customer.price_per_bottle.toLocaleString()}đ
                  </Text>
                </View>
                <View style={styles.totalAmount}>
                  <Text variant="titleMedium" style={styles.totalLabel}>Tổng tiền:</Text>
                  <Text variant="titleLarge" style={styles.totalValue}>{customer.total_amount.toLocaleString()}đ</Text>
                </View>
              </Card.Content>
            </Card>
          </Link>
        ))}
        <View style={styles.footer} />
      </ScrollView>
      <View style={styles.paginationContainer}>
        <IconButton
          icon="chevron-left"
          size={20}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={styles.paginationButton}
        />
        <Text style={styles.pageText}>Trang {currentPage}</Text>
        <IconButton
          icon="chevron-right"
          size={20}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={styles.paginationButton}
        />
      </View>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/customer/new')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 8,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontWeight: 'bold',
  },
  customerInfo: {
    marginBottom: 8,
  },
  infoText: {
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#666',
  },
  totalAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    color: '#666',
  },
  totalValue: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  footer: {
    height: 160,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: -10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  paginationButton: {
    marginHorizontal: 4,
  },
  pageText: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 8,
  },
  filterContainer: {
    padding: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    marginHorizontal: 8,
  },
}); 