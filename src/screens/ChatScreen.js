import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { COLORS, withOpacity } from '../theme/colors';

const ChatScreen = ({ route, navigation }) => {
  const { type, item } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Set the title of the screen
    navigation.setOptions({
      title: item.name || item.uid || 'Chat',
      headerStyle: {
        backgroundColor: COLORS.PRIMARY,
      },
      headerTintColor: COLORS.TEXT_LIGHT,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });

    // Fetch previous messages
    fetchPreviousMessages();

    // Add message listener
    const listenerId = 'CHAT_SCREEN_MESSAGE_LISTENER';
    CometChat.addMessageListener(
      listenerId,
      new CometChat.MessageListener({
        onTextMessageReceived: message => {
          // Check if message belongs to this conversation
          if (
            (type === CometChat.RECEIVER_TYPE.USER && message.sender.uid === item.uid) ||
            (type === CometChat.RECEIVER_TYPE.GROUP && message.receiverId === item.guid)
          ) {
            setMessages(prevMessages => [message, ...prevMessages]);
          }
        },
      })
    );

    return () => {
      CometChat.removeMessageListener(listenerId);
    };
  }, []);

  const fetchPreviousMessages = () => {
    setLoading(true);

    let messagesRequest;
    if (type === CometChat.RECEIVER_TYPE.USER) {
      messagesRequest = new CometChat.MessagesRequestBuilder()
        .setUID(item.uid)
        .setLimit(50)
        .build();
    } else {
      messagesRequest = new CometChat.MessagesRequestBuilder()
        .setGUID(item.guid)
        .setLimit(50)
        .build();
    }

    messagesRequest.fetchPrevious().then(
      messageList => {
        console.log('Message list fetched:', messageList);
        setMessages(messageList || []);
        setLoading(false);
      },
      error => {
        console.log('Message fetching failed with error:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load messages');
      }
    );
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;

    setSending(true);
    
    let receiverId;
    if (type === CometChat.RECEIVER_TYPE.USER) {
      receiverId = item.uid;
    } else {
      receiverId = item.guid;
    }

    const textMessage = new CometChat.TextMessage(receiverId, messageText, type);

    CometChat.sendMessage(textMessage).then(
      message => {
        console.log('Message sent successfully:', message);
        setMessages(prevMessages => [message, ...prevMessages]);
        setMessageText('');
        setSending(false);
      },
      error => {
        console.log('Message sending failed with error:', error);
        setSending(false);
        Alert.alert('Error', 'Failed to send message');
      }
    );
  };

  const renderItem = ({ item: message }) => {
    const currentUser = CometChat.getLoggedinUser();
    const isMyMessage = currentUser && message.sender.uid === currentUser.uid;
    
    const messageTime = new Date(message.sentAt * 1000);
    const formattedTime = messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer
      ]}>
        {!isMyMessage && (
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>
              {message.sender.name ? message.sender.name.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.theirMessageText
          ]}>
            {message.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isMyMessage ? styles.myMessageTime : styles.theirMessageTime
          ]}>
            {formattedTime}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} style={styles.loader} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesContainer}
          inverted={true}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
            }
          }}
        />
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !messageText.trim() ? styles.sendButtonDisabled : {}
          ]}
          onPress={sendMessage}
          disabled={sending || !messageText.trim()}
        >
          {sending ? (
            <ActivityIndicator size="small" color={COLORS.TEXT_LIGHT} />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarSmallText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
    shadowColor: COLORS.DARK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  myMessageBubble: {
    backgroundColor: COLORS.PRIMARY,
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: COLORS.CARD_BG,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  myMessageText: {
    color: COLORS.TEXT_LIGHT,
  },
  theirMessageText: {
    color: COLORS.TEXT_PRIMARY,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: withOpacity(COLORS.TEXT_LIGHT, 0.7),
  },
  theirMessageTime: {
    color: COLORS.TEXT_SECONDARY,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: COLORS.CARD_BG,
    borderTopWidth: 1,
    borderTopColor: withOpacity(COLORS.BORDER, 0.5),
  },
  input: {
    flex: 1,
    backgroundColor: withOpacity(COLORS.BACKGROUND, 0.5),
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 12,
    maxHeight: 100,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: COLORS.ACCENT,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sendButtonDisabled: {
    backgroundColor: withOpacity(COLORS.ACCENT, 0.6),
  },
  sendButtonText: {
    color: COLORS.DARK,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default ChatScreen;