import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
  Image,
  SafeAreaView,
} from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { logoutFromCometChat } from '../services/authService';
import { COLORS, withOpacity } from '../theme/colors';

const HomeScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const getLoggedInUser = async () => {
      const user = await CometChat.getLoggedinUser();
      setUser(user);
    };

    getLoggedInUser();
    fetchConversations();

    // Listen for new messages
    CometChat.addMessageListener(
      'HOME_SCREEN_MESSAGE_LISTENER',
      new CometChat.MessageListener({
        onTextMessageReceived: message => {
          console.log('Text message received:', message);
          fetchConversations(); // Refresh the list
        },
      })
    );

    return () => {
      CometChat.removeMessageListener('HOME_SCREEN_MESSAGE_LISTENER');
    };
  }, []);

  const fetchConversations = () => {
    setLoading(true);
    
    const conversationsRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(50)
      .build();

    conversationsRequest.fetchNext().then(
      conversationList => {
        console.log('Conversations list fetched:', conversationList);
        setConversations(conversationList || []);
        setLoading(false);
      },
      error => {
        console.log('Conversations list fetching failed:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load conversations');
      }
    );
  };

  const handleLogout = async () => {
    try {
      await logoutFromCometChat();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  const openChat = (item) => {
    // Check if this is a mock item or a real CometChat conversation
    if (item.isMockData) {
      // For mock data, navigate to groups list since we don't have real data
      navigation.navigate('GroupsList');
      return;
    }

    // For real CometChat data
    const conversationWith = item.conversationWith;
    if (!conversationWith) {
      console.error('Conversation data is missing the conversationWith property', item);
      Alert.alert('Error', 'Unable to open this conversation');
      return;
    }
    
    let chatWithUser;
    let chatWithGroup;
    
    if (conversationWith.hasOwnProperty('uid')) {
      // It's a user
      chatWithUser = conversationWith;
      navigation.navigate('Chat', {
        type: CometChat.RECEIVER_TYPE.USER,
        item: chatWithUser
      });
    } else {
      // It's a group
      chatWithGroup = conversationWith;
      navigation.navigate('Chat', { 
        type: CometChat.RECEIVER_TYPE.GROUP,
        item: chatWithGroup
      });
    }
  };

  const openUsersList = () => {
    navigation.navigate('UsersList');
  };

  const openGroupsList = () => {
    navigation.navigate('GroupsList');
  };

  // Mocked groups data to match the design
  const groupsData = [
    {
      id: 'g1',
      name: 'Въведение в C++',
      lastMessage: 'Don\'t forget our meeting at 3 PM.',
      time: '10:30 AM',
      color: '#614EC1',
      online: true,
      isMockData: true
    },
    {
      id: 'g2',
      name: 'Информатика 2023-2027',
      lastMessage: 'New event: Tech Talk this Friday.',
      time: '9:15 AM',
      color: '#74F269',
      online: false,
      isMockData: true
    },
    {
      id: 'g3',
      name: 'Клуб по дебати',
      lastMessage: 'Линк към готино обучение...',
      time: 'Yesterday',
      color: '#614EC1',
      online: false,
      isMockData: true
    },
    {
      id: 'g4',
      name: 'Дизайн принципи',
      lastMessage: 'Game night tomorrow!',
      time: 'Yesterday',
      color: '#74F269',
      online: false,
      isMockData: true
    },
    {
      id: 'g5',
      name: 'Дизайн принципи',
      lastMessage: 'Game night tomorrow!',
      time: 'Yesterday',
      color: '#614EC1',
      online: false,
      isMockData: true
    },
    {
      id: 'g6',
      name: 'Дизайн принципи',
      lastMessage: 'Game night tomorrow!',
      time: 'Yesterday',
      color: '#74F269',
      online: false,
      isMockData: true
    },
  ];

  const handleGroupPress = (item) => {
    // If we have real conversations, use them
    if (conversations && conversations.length > 0) {
      // Find a matching conversation or use the first one
      const matchingConversation = conversations.find(
        conv => conv.conversationWith && conv.conversationWith.name === item.name
      ) || conversations[0];
      
      openChat(matchingConversation);
    } else {
      // Otherwise just use the mock item and navigate to groups
      openGroupsList();
    }
  };

  const renderGroupItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.groupItem} 
        onPress={() => handleGroupPress(item)}
      >
        <View style={[styles.groupAvatar, { backgroundColor: item.color }]}>
          {item.online && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.groupDetails}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTabBar = () => {
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('calendar')}
        >
          <View style={[styles.tabIcon, activeTab === 'calendar' ? styles.activeTabIcon : {}]}>
            <Text style={styles.tabIconText}>📅</Text>
          </View>
          <Text style={styles.tabText}>Календар</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => {
            setActiveTab('chats');
            openUsersList();
          }}
        >
          <View style={[styles.tabIcon, activeTab === 'chats' ? styles.activeTabIcon : {}]}>
            <Text style={styles.tabIconText}>💬</Text>
          </View>
          <Text style={styles.tabText}>Разговори</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('home')}
        >
          <View style={[styles.tabIcon, styles.homeTabIcon, activeTab === 'home' ? styles.activeHomeTabIcon : {}]}>
            <Text style={styles.tabIconText}>🏠</Text>
          </View>
          <Text style={[styles.tabText, activeTab === 'home' ? styles.activeTabText : {}]}>Начало</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('games')}
        >
          <View style={[styles.tabIcon, activeTab === 'games' ? styles.activeTabIcon : {}]}>
            <Text style={styles.tabIconText}>🎮</Text>
          </View>
          <Text style={styles.tabText}>Игри</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('career')}
        >
          <View style={[styles.tabIcon, activeTab === 'career' ? styles.activeTabIcon : {}]}>
            <Text style={styles.tabIconText}>💼</Text>
          </View>
          <Text style={styles.tabText}>Кариери</Text>
        </TouchableOpacity>
      </View>
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

      {/* Groups Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Моите групи</Text>
      </View>

      {/* Group List */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} style={styles.loader} />
      ) : (
        <FlatList
          data={groupsData}
          keyExtractor={(item) => item.id}
          renderItem={renderGroupItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom Tab Bar */}
      {renderTabBar()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  groupItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  groupAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: '#fff',
  },
  groupDetails: {
    flex: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  timeText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
  },
  tabItem: {
    alignItems: 'center',
    width: 70,
  },
  tabIcon: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeTabIcon: {
    backgroundColor: '#f0f0f0',
    borderRadius: 11,
  },
  homeTabIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    marginTop: -15,
  },
  activeHomeTabIcon: {
    backgroundColor: '#614EC1',
  },
  tabIconText: {
    fontSize: 16,
  },
  tabText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#614EC1',
    fontWeight: '500',
  },
});

export default HomeScreen;