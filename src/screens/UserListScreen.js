import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  StatusBar,
} from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { COLORS, withOpacity } from '../theme/colors';

const UsersListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Set header options
    navigation.setOptions({
      headerStyle: {
        backgroundColor: COLORS.PRIMARY,
      },
      headerTintColor: COLORS.TEXT_LIGHT,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
    
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    
    const usersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(100)
      .build();

    usersRequest.fetchNext().then(
      userList => {
        console.log('User list fetched:', userList);
        setUsers(userList || []);
        setLoading(false);
      },
      error => {
        console.log('User list fetching failed:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load users');
      }
    );
  };

  const searchUsers = () => {
    if (!searchText.trim()) {
      fetchUsers();
      return;
    }

    setLoading(true);
    
    const usersRequest = new CometChat.UsersRequestBuilder()
      .setSearchKeyword(searchText)
      .setLimit(100)
      .build();

    usersRequest.fetchNext().then(
      userList => {
        console.log('User search results:', userList);
        setUsers(userList || []);
        setLoading(false);
      },
      error => {
        console.log('User search failed:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to search users');
      }
    );
  };

  const startConversation = (user) => {
    navigation.navigate('Chat', {
      type: CometChat.RECEIVER_TYPE.USER,
      item: user
    });
  };

  const renderItem = ({ item }) => {
    // Don't show the current logged-in user
    const loggedInUser = CometChat.getLoggedinUser();
    if (loggedInUser && item.uid === loggedInUser.uid) {
      return null;
    }

    return (
      <TouchableOpacity 
        style={styles.userItem} 
        onPress={() => startConversation(item)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name ? item.name.charAt(0).toUpperCase() : '?'}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.name}>{item.name || item.uid}</Text>
          <Text style={[styles.status, item.status === 'online' ? styles.statusOnline : styles.statusOffline]}>
            {item.status === 'online' ? 'Online' : 'Offline'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for users..."
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          onSubmitEditing={searchUsers}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchUsers}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} style={styles.loader} />
      ) : users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.uid}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
          </View>
          <Text style={styles.emptyText}>No users found</Text>
          {searchText ? (
            <TouchableOpacity style={styles.refreshButton} onPress={fetchUsers}>
              <Text style={styles.refreshButtonText}>Reset Search</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.CARD_BG,
    borderBottomWidth: 1,
    borderBottomColor: withOpacity(COLORS.BORDER, 0.3),
  },
  searchInput: {
    flex: 1,
    backgroundColor: withOpacity(COLORS.BACKGROUND, 0.5),
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: COLORS.DARK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  searchButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD_BG,
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.DARK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 22,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusOnline: {
    color: COLORS.ACCENT,
  },
  statusOffline: {
    color: COLORS.TEXT_SECONDARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIconContainer: {
    backgroundColor: withOpacity(COLORS.PRIMARY, 0.1),
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UsersListScreen;