import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const gameItemWidth = (width - 60) / 2;

const GamesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("games");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock games data
  const games = [
    {
      id: "1",
      title: "Судоку",
      image:
        "https://img.freepik.com/free-vector/sudoku-game-concept-illustration_114360-7805.jpg",
      players: "1.2K",
      category: "puzzle",
    },
    {
      id: "2",
      title: "Шах",
      image:
        "https://img.freepik.com/free-vector/chess-concept-illustration_114360-4336.jpg",
      players: "987",
      category: "strategy",
    },
    {
      id: "3",
      title: "Тетрис",
      image:
        "https://img.freepik.com/free-vector/tetris-concept-illustration_114360-1599.jpg",
      players: "2.5K",
      category: "arcade",
    },
    {
      id: "4",
      title: "Морски шах",
      image:
        "https://img.freepik.com/free-vector/tic-tac-toe-concept-illustration_114360-1245.jpg",
      players: "652",
      category: "classic",
    },
    {
      id: "5",
      title: "Бесеница",
      image:
        "https://img.freepik.com/free-vector/man-playing-hangman-game-concept-illustration_114360-7358.jpg",
      players: "821",
      category: "word",
    },
    {
      id: "6",
      title: "Памет",
      image:
        "https://img.freepik.com/free-vector/memory-game-concept-illustration_114360-2510.jpg",
      players: "493",
      category: "puzzle",
    },
  ];

  // Filter games based on selected category
  const filteredGames =
    selectedCategory === "all"
      ? games
      : games.filter((game) => game.category === selectedCategory);

  // Categories for filtering
  const categories = [
    { id: "all", name: "Всички" },
    { id: "puzzle", name: "Пъзели" },
    { id: "strategy", name: "Стратегия" },
    { id: "arcade", name: "Аркадни" },
    { id: "classic", name: "Класически" },
    { id: "word", name: "Думи" },
  ];

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categorySelected,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categorySelectedText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderGameItem = ({ item }) => (
    <TouchableOpacity style={styles.gameItem}>
      <Image source={{ uri: item.image }} style={styles.gameImage} />
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <View style={styles.playersContainer}>
          <Text style={styles.playersIcon}>👤</Text>
          <Text style={styles.playersText}>{item.players}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTabBar = () => {
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setActiveTab("calendar");
            navigation.navigate("Calendar");
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
            setActiveTab("chats");
            navigation.navigate("UsersListScreen");
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
            setActiveTab("home");
            navigation.navigate("Home");
          }}
        >
          <View style={[styles.tabIcon, styles.homeTabIcon]}>
            <Text style={styles.tabIconText}>🏠</Text>
          </View>
          <Text style={styles.tabText}>Начало</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab("games")}
        >
          <View style={[styles.tabIcon, styles.activeTabIcon]}>
            <Text style={styles.tabIconText}>🎮</Text>
          </View>
          <Text style={[styles.tabText, styles.activeTabText]}>Игри</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setActiveTab("career");
            navigation.navigate("Career");
          }}
        >
          <View style={styles.tabIcon}>
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
        <TouchableOpacity>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Games Grid */}
      <FlatList
        data={filteredGames}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gamesList}
        columnWrapperStyle={styles.gamesRow}
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
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#614EC1",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  categoriesContainer: {
    marginTop: 10,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
  },
  categorySelected: {
    backgroundColor: "#614EC1",
  },
  categoryText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  categorySelectedText: {
    color: "#ffffff",
    fontWeight: "500",
  },
  gamesList: {
    padding: 20,
  },
  gamesRow: {
    justifyContent: "space-between",
  },
  gameItem: {
    width: gameItemWidth,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
    overflow: "hidden",
  },
  gameImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  gameInfo: {
    padding: 12,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  playersContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  playersIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  playersText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 8,
  },
  tabItem: {
    alignItems: "center",
    width: 70,
  },
  tabIcon: {
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  activeTabIcon: {
    backgroundColor: "#f0f0f0",
    borderRadius: 11,
  },
  homeTabIcon: {
    width: 50,
    height: 50,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    marginTop: -15,
  },
  tabIconText: {
    fontSize: 16,
  },
  tabText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  activeTabText: {
    color: "#614EC1",
    fontWeight: "500",
  },
});

export default GamesScreen;
