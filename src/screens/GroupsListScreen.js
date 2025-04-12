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
  Modal,
  StatusBar,
} from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { COLORS, withOpacity } from '../theme/colors';

const GroupsListScreen = ({ navigation }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupType, setNewGroupType] = useState('public');
  const [creatingGroup, setCreatingGroup] = useState(false);

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
    
    fetchGroups();
  }, []);

  const fetchGroups = () => {
    setLoading(true);
    
    const groupsRequest = new CometChat.GroupsRequestBuilder()
      .setLimit(100)
      .build();

    groupsRequest.fetchNext().then(
      groupList => {
        console.log('Group list fetched:', groupList);
        setGroups(groupList || []);
        setLoading(false);
      },
      error => {
        console.log('Group list fetching failed:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load groups');
      }
    );
  };

  const searchGroups = () => {
    if (!searchText.trim()) {
      fetchGroups();
      return;
    }

    setLoading(true);
    
    const groupsRequest = new CometChat.GroupsRequestBuilder()
      .setSearchKeyword(searchText)
      .setLimit(100)
      .build();

    groupsRequest.fetchNext().then(
      groupList => {
        console.log('Group search results:', groupList);
        setGroups(groupList || []);
        setLoading(false);
      },
      error => {
        console.log('Group search failed:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to search groups');
      }
    );
  };

  const createGroup = () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    setCreatingGroup(true);

    // Create unique group ID
    const guid = 'group_' + new Date().getTime();
    
    const group = new CometChat.Group(guid, newGroupName, newGroupType, '');

    CometChat.createGroup(group).then(
      newGroup => {
        console.log('Group created successfully:', newGroup);
        setCreatingGroup(false);
        setModalVisible(false);
        setNewGroupName('');
        // Refresh the list
        fetchGroups();
      },
      error => {
        console.log('Group creation failed:', error);
        setCreatingGroup(false);
        Alert.alert('Error', 'Failed to create group');
      }
    );
  };

  const joinGroup = (group) => {
    if (group.hasJoined) {
      // Open the chat directly if already joined
      navigation.navigate('Chat', {
        type: CometChat.RECEIVER_TYPE.GROUP,
        item: group
      });
      return;
    }

    // For private and password protected groups
    if (group.type === CometChat.GROUP_TYPE.PASSWORD) {
      // Here you would typically prompt for a password
      Alert.alert(
        'Password Required',
        'This group requires a password to join.',
        [{ text: 'OK' }]
      );
      return;
    } else if (group.type === CometChat.GROUP_TYPE.PRIVATE) {
      Alert.alert(
        'Private Group',
        'This is a private group. Only the admin can add you.',
        [{ text: 'OK' }]
      );
      return;
    }

    // For public groups, join directly
    CometChat.joinGroup(group.guid, group.type, '').then(
      response => {
        console.log('Group joining successful:', response);
        // Navigate to the group chat
        navigation.navigate('Chat', {
          type: CometChat.RECEIVER_TYPE.GROUP,
          item: group
        });
      },
      error => {
        console.log('Group joining failed:', error);
        Alert.alert('Error', 'Failed to join group');
      }
    );
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.groupItem} 
        onPress={() => joinGroup(item)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name ? item.name.charAt(0).toUpperCase() : 'G'}</Text>
        </View>
        <View style={styles.groupDetails}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.type}>
            {item.type === 'public' ? 'Public' : item.type === 'private' ? 'Private' : 'Password Protected'} • 
            {' ' + item.membersCount} members
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, item.hasJoined ? styles.joinedIndicator : styles.notJoinedIndicator]} />
            <Text style={[styles.joinStatus, item.hasJoined ? styles.joined : styles.notJoined]}>
              {item.hasJoined ? 'Joined' : 'Not Joined'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.PRIMARY} barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            onSubmitEditing={searchGroups}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchGroups}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.createButtonText}>Create Group</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} style={styles.loader} />
      ) : groups.length > 0 ? (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.guid}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
          </View>
          <Text style={styles.emptyText}>No groups found</Text>
          <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.createButtonText}>Create a New Group</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Create Group Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create a New Group</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Group Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter group name"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
                value={newGroupName}
                onChangeText={setNewGroupName}
              />
            </View>

            <Text style={styles.modalLabel}>Group Type:</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newGroupType === 'public' && styles.selectedType
                ]}
                onPress={() => setNewGroupType('public')}
              >
                <Text style={[
                  styles.typeText,
                  newGroupType === 'public' && styles.selectedTypeText
                ]}>Public</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newGroupType === 'private' && styles.selectedType
                ]}
                onPress={() => setNewGroupType('private')}
              >
                <Text style={[
                  styles.typeText,
                  newGroupType === 'private' && styles.selectedTypeText
                ]}>Private</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newGroupType === 'password' && styles.selectedType
                ]}
                onPress={() => setNewGroupType('password')}
              >
                <Text style={[
                  styles.typeText,
                  newGroupType === 'password' && styles.selectedTypeText
                ]}>Password</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.createModalButton}
                onPress={createGroup}
                disabled={creatingGroup}
              >
                {creatingGroup ? (
                  <ActivityIndicator size="small" color={COLORS.TEXT_LIGHT} />
                ) : (
                  <Text style={styles.createModalButtonText}>Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    backgroundColor: COLORS.CARD_BG,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: withOpacity(COLORS.BORDER, 0.3),
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
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
  createButton: {
    backgroundColor: COLORS.ACCENT,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: COLORS.DARK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  createButtonText: {
    color: COLORS.DARK,
    fontWeight: 'bold',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  groupItem: {
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
  groupDetails: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  type: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  joinedIndicator: {
    backgroundColor: COLORS.ACCENT,
  },
  notJoinedIndicator: {
    backgroundColor: COLORS.TEXT_SECONDARY,
  },
  joinStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  joined: {
    color: COLORS.ACCENT,
  },
  notJoined: {
    color: COLORS.TEXT_SECONDARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIconContainer: {
    backgroundColor: withOpacity(COLORS.SECONDARY, 0.1),
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    shadowColor: COLORS.DARK,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: withOpacity(COLORS.BACKGROUND, 0.5),
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderColor: withOpacity(COLORS.BORDER, 0.3),
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: withOpacity(COLORS.BORDER, 0.5),
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  selectedType: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  typeText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  selectedTypeText: {
    color: COLORS.TEXT_LIGHT,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: withOpacity(COLORS.BORDER, 0.5),
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  createModalButton: {
    backgroundColor: COLORS.ACCENT,
    padding: 14,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  createModalButtonText: {
    color: COLORS.DARK,
    fontWeight: 'bold',
  },
});

export default GroupsListScreen;