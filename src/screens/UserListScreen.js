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
  Image,
  SafeAreaView,
} from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { logoutFromCometChat } from '../services/authService';

const UserListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
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

  const handleLogout = async () => {
    try {
      await logoutFromCometChat();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
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
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>megdan</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Търсене на потребители..."
          placeholderTextColor="#8E8E93"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          onSubmitEditing={searchUsers}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchUsers}>
          <Text style={styles.searchButtonText}>Търси</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#614EC1" style={styles.loader} />
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
          <Text style={styles.emptyText}>Няма намерени потребители</Text>
          {searchText ? (
            <TouchableOpacity style={styles.refreshButton} onPress={fetchUsers}>
              <Text style={styles.refreshButtonText}>Нулиране на търсенето</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#614EC1',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#614EC1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#ffffff',
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
    backgroundColor: '#F2F2F7',
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#614EC1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusOnline: {
    color: '#74F269',
  },
  statusOffline: {
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIconContainer: {
    backgroundColor: 'rgba(97, 78, 193, 0.1)',
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
    color: '#000000',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#614EC1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserListScreen;