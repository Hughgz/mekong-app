import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import { supabase } from '../../services/supabase';

export default function NewCustomerScreen() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    price_per_bottle: '',
    total_bottles_delivered: '0',
    total_bottles_returned: '0',
    total_amount: '0',
  });

  useEffect(() => {
    // Tính tổng tiền khi số bình hoặc giá thay đổi
    const bottlesDelivered = Number(formData.total_bottles_delivered) || 0;
    const pricePerBottle = Number(formData.price_per_bottle) || 0;
    const totalAmount = bottlesDelivered * pricePerBottle;
    setFormData(prev => ({ ...prev, total_amount: totalAmount.toString() }));
  }, [formData.total_bottles_delivered, formData.price_per_bottle]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.price_per_bottle) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('customers')
        .insert([{
          ...formData,
          price_per_bottle: Number(formData.price_per_bottle),
          total_bottles_delivered: Number(formData.total_bottles_delivered),
          total_bottles_returned: Number(formData.total_bottles_returned),
          total_amount: Number(formData.total_amount),
        }]);

      if (error) throw error;
      router.back();
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <Surface style={styles.surface} elevation={2}>
          <View style={styles.formContainer}>
            <Text variant="headlineSmall" style={styles.title}>Thông tin khách hàng mới</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>Vui lòng điền đầy đủ thông tin bên dưới</Text>
            
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
                left={<TextInput.Icon icon="cash" />}
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
                  left={<TextInput.Icon icon="water" />}
                  theme={{ roundness: 12 }}
                />

                <TextInput
                  label="Số bình đã trả"
                  value={formData.total_bottles_returned}
                  onChangeText={(text) => setFormData({ ...formData, total_bottles_returned: text })}
                  style={[styles.input, styles.halfInput]}
                  mode="outlined"
                  keyboardType="numeric"
                  left={<TextInput.Icon icon="water-outline" />}
                  theme={{ roundness: 12 }}
                />
              </View>

              <View style={styles.totalAmountContainer}>
                <Text variant="titleMedium" style={styles.totalLabel}>Tổng tiền:</Text>
                <Text variant="headlineMedium" style={styles.totalValue}>
                  {Number(formData.total_amount).toLocaleString()}đ
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => router.back()}
                style={[styles.button, styles.cancelButton]}
                labelStyle={styles.buttonLabel}
                theme={{ roundness: 12 }}
              >
                Hủy
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading || !formData.name || !formData.phone || !formData.address || !formData.price_per_bottle}
                style={[styles.button, styles.submitButton]}
                labelStyle={styles.buttonLabel}
                theme={{ roundness: 12 }}
              >
                Thêm khách hàng
              </Button>
            </View>
          </View>
        </Surface>
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
  surface: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 24,
  },
  title: {
    textAlign: 'center',
    color: '#1976D2',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  inputContainer: {
    gap: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  input: {
    backgroundColor: '#fff',
  },
  halfInput: {
    flex: 1,
  },
  totalAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginTop: 8,
  },
  totalLabel: {
    color: '#666',
  },
  totalValue: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 16,
  },
  button: {
    flex: 1,
    height: 48,
  },
  cancelButton: {
    borderColor: '#1976D2',
  },
  submitButton: {
    backgroundColor: '#1976D2',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 