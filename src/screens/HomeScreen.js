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
  Modal,
} from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { logoutFromCometChat } from '../services/authService';

const HomeScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseModalVisible, setCourseModalVisible] = useState(false);

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
    channelName: "Информатика - Общ канал",
    channelDescription: "Общ канал за всички студенти от програмата по информатика",
    channelMembers: 423,
    channelMessages: [
      {
        id: "m1",
        text: "Здравейте колеги! Някой има ли информация за конференцията по изкуствен интелект следващия месец?",
        sender: "Мария Иванова",
        time: "Днес, 14:25",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg"
      },
      {
        id: "m2",
        text: "Да, ще се проведе на 15-ти в Зала 1. Регистрацията е отворена на сайта на факултета.",
        sender: "Георги Петров",
        time: "Днес, 14:32",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg"
      },
      {
        id: "m3",
        text: "Уважаеми студенти, не забравяйте, че до края на седмицата трябва да подадете заявления за летните стажове.",
        sender: "Проф. Димитров",
        time: "Вчера, 16:10",
        avatar: "https://randomuser.me/api/portraits/men/42.jpg"
      }
    ]
  };

  // Courses data
  const courses = [
    {
      id: "c1",
      name: "Въведение в програмирането",
      lecturer: "доц. д-р Иван Петров",
      schedule: "Понеделник, 10:00-12:00, Зала 311",
      color: "#614EC1",
      description: "Курсът въвежда основните концепции на програмирането - променливи, типове данни, условни конструкции, цикли, функции и обекти. Практическите занятия са базирани на езика Python. Студентите ще разработват малки приложения и алгоритми.",
      credits: 6,
      year: "2024-2028",
      chatMessages: [
        {
          id: "cm1",
          text: "Някой може ли да обясни задача 3 от домашното?",
          sender: "Петър Стоянов",
          time: "Днес, 11:20",
          avatar: "https://randomuser.me/api/portraits/men/55.jpg"
        },
        {
          id: "cm2",
          text: "За цикъла трябва да използваш условие с break, а не while True.",
          sender: "Ивана Георгиева",
          time: "Днес, 11:25",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
          id: "cm3",
          text: "Не забравяйте, че утре имаме упражнение в Компютърна лаборатория 2 вместо в Зала 311.",
          sender: "доц. д-р Иван Петров",
          time: "Вчера, 15:40",
          avatar: "https://randomuser.me/api/portraits/men/42.jpg"
        }
      ]
    },
    {
      id: "c2",
      name: "Дискретни структури",
      lecturer: "проф. д-р Елена Колева",
      schedule: "Вторник, 14:00-16:00, Зала 200",
      color: "#74F269",
      description: "Курсът запознава студентите с математическите основи на компютърните науки. Изучават се логика, множества, релации, функции, комбинаторика, теория на графите и алгебрични структури.",
      credits: 5,
      year: "2024-2028",
      chatMessages: [
        {
          id: "cm4",
          text: "Някой разбра ли материала за булевите функции?",
          sender: "Калоян Христов",
          time: "Днес, 09:15",
          avatar: "https://randomuser.me/api/portraits/men/60.jpg"
        },
        {
          id: "cm5",
          text: "Да, имам добри записки. Мога да ги споделя в онлайн хранилището.",
          sender: "Милена Тодорова",
          time: "Днес, 09:30",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
      ]
    },
    {
      id: "c3",
      name: "Алгебра и геометрия",
      lecturer: "доц. д-р Стоян Митев",
      schedule: "Четвъртък, 12:00-14:00, Зала 101",
      color: "#107778",
      description: "Курсът обхваща основни концепции от линейната алгебра и аналитичната геометрия. Разглеждат се вектори, матрици, системи линейни уравнения, линейни пространства и трансформации.",
      credits: 5,
      year: "2024-2028",
      chatMessages: []
    },
    {
      id: "c4",
      name: "Увод в компютърните системи",
      lecturer: "гл. ас. д-р Мария Тодорова",
      schedule: "Петък, 09:00-11:00, Лаб. 3",
      color: "#614EC1",
      description: "Курсът представя основни принципи на компютърните системи - архитектура, операционни системи, мрежи и системно програмиране. Практическата част включва работа с Linux и основи на системното програмиране.",
      credits: 6,
      year: "2024-2028",
      chatMessages: []
    }
  ];

  // Groups data
  const groupsData = [
    {
      id: 'g1',
      name: 'Информатика 2024-2028',
      lastMessage: 'Здравейте, има ли информация кога излизат резултатите от контролното?',
      time: '12:30',
      color: '#614EC1',
      online: true,
      isMockData: true
    },
    {
      id: 'g2',
      name: 'Спорт и свободно време',
      lastMessage: 'Някой за волейбол в събота следобед?',
      time: '09:15',
      color: '#74F269',
      online: false,
      isMockData: true
    },
    {
      id: 'g3',
      name: 'Стажове и кариера',
      lastMessage: 'Отвориха нови позиции в SAP, крайният срок е 30-ти.',
      time: 'Yesterday',
      color: '#107778',
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

  const openCourseModal = (course) => {
    setSelectedCourse(course);
    setCourseModalVisible(true);
  };

  const closeCourseModal = () => {
    setCourseModalVisible(false);
    setSelectedCourse(null);
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

  const renderCourseItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={[styles.courseItem, { borderLeftColor: item.color }]} 
        onPress={() => openCourseModal(item)}
      >
        <Text style={styles.courseName}>{item.name}</Text>
        <Text style={styles.courseLecturer}>{item.lecturer}</Text>
        <Text style={styles.courseSchedule}>{item.schedule}</Text>
      </TouchableOpacity>
    );
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

  const renderCourseModal = () => {
    if (!selectedCourse) return null;

    return (
      <Modal
        visible={courseModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeCourseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedCourse.name}</Text>
              <TouchableOpacity onPress={closeCourseModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={[styles.courseBadge, { backgroundColor: selectedCourse.color }]}>
                <Text style={styles.courseBadgeText}>{selectedCourse.year}</Text>
              </View>
              
              <View style={styles.courseInfoSection}>
                <Text style={styles.courseInfoLabel}>Преподавател:</Text>
                <Text style={styles.courseInfoValue}>{selectedCourse.lecturer}</Text>
              </View>
              
              <View style={styles.courseInfoSection}>
                <Text style={styles.courseInfoLabel}>График:</Text>
                <Text style={styles.courseInfoValue}>{selectedCourse.schedule}</Text>
              </View>
              
              <View style={styles.courseInfoSection}>
                <Text style={styles.courseInfoLabel}>Кредити:</Text>
                <Text style={styles.courseInfoValue}>{selectedCourse.credits} ECTS</Text>
              </View>
              
              <View style={styles.courseInfoSection}>
                <Text style={styles.courseInfoLabel}>Описание:</Text>
                <Text style={styles.courseDescriptionText}>{selectedCourse.description}</Text>
              </View>
              
              <View style={styles.courseChatSection}>
                <Text style={styles.courseChatTitle}>Чат за курса</Text>
                
                {selectedCourse.chatMessages && selectedCourse.chatMessages.length > 0 ? (
                  <View style={styles.courseChatContainer}>
                    <FlatList
                      data={selectedCourse.chatMessages}
                      renderItem={renderMessageItem}
                      keyExtractor={item => item.id}
                      scrollEnabled={false}
                    />
                  </View>
                ) : (
                  <View style={styles.emptyChatContainer}>
                    <Text style={styles.emptyChatText}>Няма съобщения в този чат</Text>
                    <Text style={styles.emptyChatSubtext}>Бъдете първият, който ще започне разговор</Text>
                  </View>
                )}
                
                <TouchableOpacity style={styles.viewChatButton}>
                  <Text style={styles.viewChatButtonText}>Отвори чата</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
        </View>
      
        {/* General Informatics Chat Channel */}
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

        {/* Courses Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Текущи курсове</Text>
        </View>

        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          style={styles.coursesList}
        />

        {/* Groups Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Моите групи</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#614EC1" style={styles.loader} />
        ) : (
          <FlatList
            data={groupsData}
            renderItem={renderGroupItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* Course Modal */}
      {renderCourseModal()}
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
    paddingBottom: 40,
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
  // Course Styles
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  coursesList: {
    marginBottom: 20,
  },
  courseItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  courseLecturer: {
    fontSize: 14,
    color: '#614EC1',
    marginBottom: 5,
  },
  courseSchedule: {
    fontSize: 14,
    color: '#666',
  },
  // Group Styles
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#8E8E93',
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  courseBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 15,
  },
  courseBadgeText: {
    color: '#fff',
    fontWeight: '600',
  },
  courseInfoSection: {
    marginBottom: 15,
  },
  courseInfoLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  courseInfoValue: {
    fontSize: 16,
    color: '#000',
  },
  courseDescriptionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  courseChatSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  courseChatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  courseChatContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  emptyChatContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  emptyChatText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 5,
  },
  emptyChatSubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
  viewChatButton: {
    backgroundColor: '#614EC1',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  viewChatButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;