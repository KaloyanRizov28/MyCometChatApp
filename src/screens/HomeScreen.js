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
} from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { logoutFromCometChat } from '../services/authService';
import { COLORS } from '../theme/colors';

const HomeScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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

  const openChat = item => {
    const conversationWith = item.conversationWith;
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

  const renderItem = ({ item }) => {
    const conversationWith = item.conversationWith;
    const lastMessage = item.lastMessage;
    
    let name = conversationWith.name;
    let lastMessageText = '';
    
    if (lastMessage) {
      if (lastMessage.type === 'text') {
        lastMessageText = lastMessage.text;
      } else {
        lastMessageText = lastMessage.type + ' message';
      }
    }

    return (
      <TouchableOpacity 
        style={styles.conversationItem} 
        onPress={() => openChat(item)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.conversationDetails}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessageText || 'Start a conversation'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Chats</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.headerButton, styles.activeButton]} 
            onPress={() => {}}>
            <Text style={styles.headerButtonActiveText}>Conversations</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={openUsersList}>
            <Text style={styles.headerButtonText}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={openGroupsList}>
            <Text style={styles.headerButtonText}>Groups</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} style={styles.loader} />
      ) : conversations.length > 0 ? (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.conversationId}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
          </View>
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubText}>
            Start chatting by finding users or joining groups
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.startButton, { backgroundColor: COLORS.PRIMARY }]} 
              onPress={openUsersList}
            >
              <Text style={styles.startButtonText}>Find Users</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.startButton, { backgroundColor: COLORS.SECONDARY }]} 
              onPress={openGroupsList}
            >
              <Text style={styles.startButtonText}>Find Groups</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <TouchableOpacity style={styles.fab} onPress={openUsersList}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.PRIMARY,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: COLORS.DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    marginTop: 5,
  },
  headerButton: {
    marginRight: 20,
    paddingVertical: 8,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.ACCENT,
  },
  headerButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  headerButtonActiveText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: '700',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.CARD_BG,
    padding: 16,
    marginBottom: 12,
    borderRadius: 14,
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
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 22,
    fontWeight: 'bold',
  },
  conversationDetails: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  lastMessage: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
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
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
  },
  emptySubText: {
    textAlign: 'center',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 30,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  startButton: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
    marginHorizontal: 6,
    shadowColor: COLORS.DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  startButtonText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.DARK,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  fabText: {
    fontSize: 30,
    color: COLORS.DARK,
    fontWeight: 'bold',
  },
});

export default HomeScreen;