import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
} from 'react-native';

const CareerScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('career');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock job listings data
  const jobListings = [
    {
      id: '1',
      title: 'Junior Software Developer',
      company: 'Tech Solutions Ltd.',
      location: 'София',
      type: 'Пълно работно време',
      logo: 'https://img.freepik.com/free-vector/gradient-tech-logo-template_23-2149000379.jpg',
      posted: '2 дни',
      skills: ['Java', 'Python', 'SQL'],
    },
    {
      id: '2',
      title: 'UX/UI Designer',
      company: 'Creative Studio',
      location: 'Пловдив',
      type: 'Хибридно',
      logo: 'https://img.freepik.com/free-vector/gradient-company-logo-template_23-2149002328.jpg',
      posted: '5 дни',
      skills: ['Figma', 'Adobe XD', 'Sketch'],
    },
    {
      id: '3',
      title: 'Data Analyst',
      company: 'Data Insights',
      location: 'Варна',
      type: 'Дистанционно',
      logo: 'https://img.freepik.com/free-vector/gradient-analytics-logo-template_23-2149182878.jpg',
      posted: '1 ден',
      skills: ['SQL', 'Tableau', 'Excel'],
    },
    {
      id: '4',
      title: 'Front-End Developer',
      company: 'Web Solutions',
      location: 'София',
      type: 'Пълно работно време',
      logo: 'https://img.freepik.com/free-vector/gradient-code-logo-template_23-2148809439.jpg',
      posted: '1 седмица',
      skills: ['JavaScript', 'React', 'CSS'],
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      company: 'Cloud Systems',
      location: 'Бургас',
      type: 'Дистанционно',
      logo: 'https://img.freepik.com/free-vector/gradient-network-logo-template_23-2149175140.jpg',
      posted: '3 дни',
      skills: ['Docker', 'Kubernetes', 'AWS'],
    },
  ];

  // Filter job listings based on search query
  const filteredJobs = searchQuery
    ? jobListings.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : jobListings;

  const renderJobItem = ({ item }) => (
    <TouchableOpacity style={styles.jobItem}>
      <View style={styles.jobHeader}>
        <Image source={{ uri: item.logo }} style={styles.companyLogo} />
        <View style={styles.jobHeaderInfo}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.companyName}>{item.company}</Text>
        </View>
      </View>
      
      <View style={styles.jobDetails}>
        <View style={styles.jobDetail}>
          <Text style={styles.jobDetailIcon}>📍</Text>
          <Text style={styles.jobDetailText}>{item.location}</Text>
        </View>
        <View style={styles.jobDetail}>
          <Text style={styles.jobDetailIcon}>⏰</Text>
          <Text style={styles.jobDetailText}>{item.type}</Text>
        </View>
        <View style={styles.jobDetail}>
          <Text style={styles.jobDetailIcon}>📅</Text>
          <Text style={styles.jobDetailText}>Публикувана преди {item.posted}</Text>
        </View>
      </View>
      
      <View style={styles.skillsContainer}>
        {item.skills.map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Кандидатствай</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderTabBar = () => {
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => {
            setActiveTab('calendar');
            navigation.navigate('Calendar');
          }}
        >
          <View style={styles.tabIcon}>
            <Text style={styles.tabIconText}>📅</Text>
          </View>
          <Text style={styles.tabText}>Календар</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => {
            setActiveTab('chats');
            navigation.navigate('UsersList');
          }}
        >
          <View style={styles.tabIcon}>
            <Text style={styles.tabIconText}>💬</Text>
          </View>
          <Text style={styles.tabText}>Разговори</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => {
            setActiveTab('home');
            navigation.navigate('Home');
          }}
        >
          <View style={[styles.tabIcon, styles.homeTabIcon]}>
            <Text style={styles.tabIconText}>🏠</Text>
          </View>
          <Text style={styles.tabText}>Начало</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => {
            setActiveTab('games');
            navigation.navigate('Games');
          }}
        >
          <View style={styles.tabIcon}>
            <Text style={styles.tabIconText}>🎮</Text>
          </View>
          <Text style={styles.tabText}>Игри</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('career')}
        >
          <View style={[styles.tabIcon, styles.activeTabIcon]}>
            <Text style={styles.tabIconText}>💼</Text>
          </View>
          <Text style={[styles.tabText, styles.activeTabText]}>Кариери</Text>
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
        <TouchableOpacity>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Търсене на възможности..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Job Listings */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.jobsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Tab Bar */}
      {renderTabBar()}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  clearIcon: {
    fontSize: 16,
    color: '#8E8E93',
    padding: 5,
  },
  jobsList: {
    padding: 20,
    paddingTop: 0,
  },
  jobItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  jobHeaderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#614EC1',
  },
  jobDetails: {
    marginBottom: 15,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  jobDetailIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  jobDetailText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  skillTag: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 13,
    color: '#614EC1',
  },
  applyButton: {
    backgroundColor: '#614EC1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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

export default CareerScreen;