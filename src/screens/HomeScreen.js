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
  ScrollView,
} from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { logoutFromCometChat } from '../services/authService';

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
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
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

  // Bachelor program information
  const bachelorInfo = {
    title: "Бакалавър по информатика",
    description: "Програмата осигурява задълбочени познания в областта на компютърните науки, програмирането и информационните технологии. Студентите придобиват умения за разработване на софтуер, анализ на данни и управление на ИТ проекти.",
    details: [
      "Продължителност: 4 години (8 семестъра)",
      "Кредити: 240 ECTS",
      "Форма на обучение: Редовна/Задочна",
      "Език на обучение: Български/Английски"
    ],
    courses: [
      "Въведение в програмирането",
      "Обектно-ориентирано програмиране",
      "Структури от данни и алгоритми",
      "Бази данни",
      "Уеб програмиране",
      "Изкуствен интелект",
      "Компютърни мрежи"
    ],
    channelName: "Информатика 2023-2027",
    channelDescription: "Общ канал за всички студенти от програмата по информатика",
    channelMembers: 128,
    channelMessages: [
      {
        id: "m1",
        text: "Здравейте колеги! Някой има ли записки от последната лекция по алгоритми?",
        sender: "Мария Иванова",
        time: "Днес, 14:25",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg"
      },
      {
        id: "m2",
        text: "Аз имам, ще ги кача в споделената папка довечера!",
        sender: "Георги Петров",
        time: "Днес, 14:32",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg"
      },
      {
        id: "m3",
        text: "Колеги, не забравяйте, че до петък трябва да предадем проектите по ООП.",
        sender: "Проф. Димитров",
        time: "Вчера, 16:10",
        avatar: "https://randomuser.me/api/portraits/men/42.jpg"
      }
    ]
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
    }
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
      navigation.navigate('GroupsList');
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

  const renderMessageItem = ({ item }) => {
    return (
      <View style={styles.messageItem}>
        <Image source={{ uri: item.avatar }} style={styles.messageAvatar} />
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageSender}>{item.sender}</Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Bachelor Program Section */}
        <View style={styles.programContainer}>
          <Text style={styles.programTitle}>{bachelorInfo.title}</Text>
          <Text style={styles.programDescription}>{bachelorInfo.description}</Text>
          
          <View style={styles.programDetailsContainer}>
            {bachelorInfo.details.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailText}>• {detail}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.courseContainer}>
            <Text style={styles.courseTitle}>Основни курсове:</Text>
            <View style={styles.courseList}>
              {bachelorInfo.courses.map((course, index) => (
                <View key={index} style={styles.courseTag}>
                  <Text style={styles.courseTagText}>{course}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      
        {/* Program Chat Channel */}
        <View style={styles.channelContainer}>
          <View style={styles.channelHeader}>
            <Text style={styles.channelTitle}>
              {bachelorInfo.channelName}
            </Text>
            <Text style={styles.channelMembers}>
              {bachelorInfo.channelMembers} участници
            </Text>
          </View>
          
          <Text style={styles.channelDescription}>
            {bachelorInfo.channelDescription}
          </Text>
          
          <View style={styles.messagesContainer}>
            <FlatList
              data={bachelorInfo.channelMessages}
              renderItem={renderMessageItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
          
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>Виж всички съобщения</Text>
          </TouchableOpacity>
        </View>

        {/* Groups Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Моите групи</Text>
        </View>

        {/* Group List */}
        {loading ? (
          <ActivityIndicator size="large" color="#614EC1" style={styles.loader} />
        ) : (
          <View>
            {groupsData.map(item => (
              <TouchableOpacity 
                key={item.id}
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
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
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
  // Program Styles
  programContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  programTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  programDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
  programDetailsContainer: {
    marginBottom: 15,
  },
  detailItem: {
    marginBottom: 6,
  },
  detailText: {
    fontSize: 15,
    color: '#4A4A4A',
  },
  courseContainer: {
    marginTop: 10,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  courseList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  courseTag: {
    backgroundColor: '#614EC1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  courseTagText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  // Channel Styles
  channelContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  channelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  channelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  channelMembers: {
    fontSize: 14,
    color: '#614EC1',
    fontWeight: '500',
  },
  channelDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  messagesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  viewMoreButton: {
    backgroundColor: '#614EC1',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Groups Styles
  sectionHeader: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  loader: {
    marginTop: 20,
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
});

export default HomeScreen;