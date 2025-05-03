import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Searchbar, useTheme } from 'react-native-paper';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function AppHeader({
  title,
  showBack = false,
  showSearch = false,
  searchQuery = '',
  onSearchChange,
}: AppHeaderProps) {
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
          {showBack && <Appbar.BackAction onPress={() => router.back()} />}
          {title && <Appbar.Content title={title} />}
          <Appbar.Action icon="bell" onPress={() => {}} />
          <Appbar.Action icon="account" onPress={() => {}} />
        </View>
      </Appbar.Header>
      {showSearch && (
        <Searchbar
          placeholder="Tìm kiếm..."
          onChangeText={onSearchChange}
          value={searchQuery}
          style={styles.searchBar}
        />
      )}
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
  searchBar: {
    margin: 8,
  },
}); 