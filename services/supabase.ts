import { createClient } from '@supabase/supabase-js';
import { Customer } from '../types/customer';

const supabaseUrl = 'https://ljlelcfhckyccfolxeis.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbGVsY2ZoY2t5Y2Nmb2x4ZWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxOTczNzksImV4cCI6MjA2MTc3MzM3OX0.n0tOnx-ShSj92iMC2nZ97kA7Wiei1KXn2uRmVxyBv5o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const customerService = {
  async getCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Customer[];
  },

  async createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
      .single();
    
    if (error) throw error;
    return data as Customer;
  },

  async updateCustomer(id: string, updates: Partial<Customer>) {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Customer;
  },

  async deleteCustomer(id: string) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}; 