import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Divider, IconButton, Text, TextInput, useTheme } from 'react-native-paper';
import { supabase } from '../../services/supabase';
import { Customer } from '../../types/customer';

export default function CustomerDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    price_per_bottle: '',
    total_bottles_delivered: '',
    total_bottles_returned: '',
    total_amount: '',
  });

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCustomer(data);
      setFormData({
        name: data.name,
        phone: data.phone,
        address: data.address,
        price_per_bottle: data.price_per_bottle.toString(),
        total_bottles_delivered: data.total_bottles_delivered.toString(),
        total_bottles_returned: data.total_bottles_returned.toString(),
        total_amount: data.total_amount.toString(),
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.price_per_bottle) {
      return;
    }

    try {
      setUpdating(true);
      const { error } = await supabase
        .from('customers')
        .update({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          price_per_bottle: Number(formData.price_per_bottle),
          total_bottles_delivered: Number(formData.total_bottles_delivered),
          total_bottles_returned: Number(formData.total_bottles_returned),
          total_amount: Number(formData.total_amount),
        })
        .eq('id', id);

      if (error) throw error;
      fetchCustomer();
    } catch (error) {
      console.error('Error updating customer:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loader} />
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy thông tin khách hàng</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <View style={styles.customerHeader}>
              <Text variant="titleLarge" style={styles.customerName}>{customer.name}</Text>
              <View style={styles.customerStats}>
                <View style={styles.statItem}>
                  <Text variant="bodyMedium" style={styles.statLabel}>Đã giao</Text>
                  <Text variant="titleLarge" style={styles.statValue}>
                    {customer.total_bottles_delivered}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="bodyMedium" style={styles.statLabel}>Đã trả</Text>
                  <Text variant="titleLarge" style={styles.statValue}>
                    {customer.total_bottles_returned}
                  </Text>
                </View>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoSection}>
              <Text variant="bodyLarge" style={styles.sectionTitle}>Thông tin liên hệ</Text>
              <View style={styles.infoItem}>
                <IconButton icon="phone" size={18} style={styles.infoIcon} />
                <Text variant="bodyMedium" style={styles.infoText}>{customer.phone}</Text>
              </View>
              <View style={styles.infoItem}>
                <IconButton icon="map-marker" size={18} style={styles.infoIcon} />
                <Text variant="bodyMedium" style={styles.infoText}>{customer.address}</Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoSection}>
              <Text variant="bodyLarge" style={styles.sectionTitle}>Thông tin đơn hàng</Text>
              <View style={styles.infoItem}>
                <IconButton icon="currency-vnd" size={18} style={styles.infoIcon} />
                <Text variant="bodyMedium" style={styles.infoText}>
                  Giá mỗi bình: {customer.price_per_bottle.toLocaleString()}đ
                </Text>
              </View>
              <View style={styles.infoItem}>
                <IconButton icon="cash" size={18} style={styles.infoIcon} />
                <Text variant="bodyMedium" style={styles.infoText}>
                  Tổng tiền: {customer.total_amount.toLocaleString()}đ
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.editCard} mode="elevated">
          <Card.Content>
            <Text variant="bodyLarge" style={styles.editTitle}>Cập nhật thông tin</Text>
            <View style={styles.inputContainer}>
              <TextInput
                label="Tên khách hàng"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                style={styles.input}
                mode="outlined"
                left={<TextInput.Icon icon="account" />}
                theme={{ roundness: 12 }}
              />

              <TextInput
                label="Số điện thoại"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                style={styles.input}
                mode="outlined"
                keyboardType="phone-pad"
                left={<TextInput.Icon icon="phone" />}
                theme={{ roundness: 12 }}
              />

              <TextInput
                label="Địa chỉ"
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={3}
                left={<TextInput.Icon icon="map-marker" />}
                theme={{ roundness: 12 }}
              />

              <TextInput
                label="Giá mỗi bình nước"
                value={formData.price_per_bottle}
                onChangeText={(text) => setFormData({ ...formData, price_per_bottle: text })}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                left={<TextInput.Icon icon="currency-vnd" />}
                theme={{ roundness: 12 }}
              />

              <View style={styles.rowContainer}>
                <TextInput
                  label="Số bình đã giao"
                  value={formData.total_bottles_delivered}
                  onChangeText={(text) => setFormData({ ...formData, total_bottles_delivered: text })}
                  style={[styles.input, styles.halfInput]}
                  mode="outlined"
                  keyboardType="numeric"
                  left={<TextInput.Icon icon="bottle-water" />}
                  theme={{ roundness: 12 }}
                />

                <TextInput
                  label="Số bình đã trả"
                  value={formData.total_bottles_returned}
                  onChangeText={(text) => setFormData({ ...formData, total_bottles_returned: text })}
                  style={[styles.input, styles.halfInput]}
                  mode="outlined"
                  keyboardType="numeric"
                  left={<TextInput.Icon icon="bottle-water-outline" />}
                  theme={{ roundness: 12 }}
                />
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleUpdate}
              loading={updating}
              disabled={updating}
              style={styles.updateButton}
              labelStyle={styles.buttonLabel}
              theme={{ roundness: 12 }}
            >
              Cập nhật
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    margin: 16,
    color: '#666',
  },
  card: {
    margin: 16,
    borderRadius: 16,
  },
  editCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerName: {
    fontWeight: 'bold',
    color: '#1976D2',
    fontSize: 20,
  },
  customerStats: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    marginBottom: 2,
    fontSize: 14,
  },
  statValue: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 20,
  },
  divider: {
    marginVertical: 12,
  },
  infoSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#666',
    marginBottom: 8,
    fontSize: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    margin: 0,
    marginRight: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
  },
  editTitle: {
    color: '#1976D2',
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    gap: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    backgroundColor: '#fff',
  },
  halfInput: {
    flex: 1,
  },
  updateButton: {
    marginTop: 16,
    backgroundColor: '#1976D2',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 