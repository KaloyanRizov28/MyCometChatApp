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
} from "react-native";

const CalendarScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("calendar");

  // Generate dates for the month view
  const getDaysInMonth = (month, year) => {
    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();
    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create an array to hold all the date objects
    const days = [];

    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      days.push({ day: "", date: null, isCurrentMonth: false });
    }

    // Add all days in the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        day: i,
        date,
        isCurrentMonth: true,
        isToday:
          i === new Date().getDate() &&
          month === new Date().getMonth() &&
          year === new Date().getFullYear(),
      });
    }

    return days;
  };

  const days = getDaysInMonth(selectedMonth, selectedYear);
  const monthNames = [
    "Януари",
    "Февруари",
    "Март",
    "Април",
    "Май",
    "Юни",
    "Юли",
    "Август",
    "Септември",
    "Октомври",
    "Ноември",
    "Декември",
  ];
  const weekDays = ["П", "В", "С", "Ч", "П", "С", "Н"];

  // Mock events data
  const events = [
    {
      id: "1",
      title: "Лекция по C++",
      time: "10:00 - 11:30",
      location: "Аудитория 101",
      color: "#614EC1",
    },
    {
      id: "2",
      title: "Практикум по информатика",
      time: "13:00 - 14:30",
      location: "Лаборатория 3",
      color: "#74F269",
    },
    {
      id: "3",
      title: "Среща на дебатен клуб",
      time: "16:00 - 18:00",
      location: "Конферентна зала",
      color: "#107778",
    },
  ];

  // Navigate to previous/next month
  const navigateMonth = (direction) => {
    let newMonth = selectedMonth;
    let newYear = selectedYear;

    if (direction === "prev") {
      newMonth--;
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }
    } else {
      newMonth++;
      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const renderDateItem = ({ item, index }) => {
    if (!item.day) {
      return <View style={styles.emptyDate} />;
    }

    const isSelected =
      selectedDate &&
      item.date &&
      selectedDate.getDate() === item.date.getDate() &&
      selectedDate.getMonth() === item.date.getMonth() &&
      selectedDate.getFullYear() === item.date.getFullYear();

    return (
      <TouchableOpacity
        style={[
          styles.dateItem,
          isSelected && styles.selectedDate,
          item.isToday && styles.todayDate,
        ]}
        onPress={() => setSelectedDate(item.date)}
      >
        <Text
          style={[
            styles.dateText,
            isSelected && styles.selectedDateText,
            item.isToday && styles.todayDateText,
          ]}
        >
          {item.day}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEventItem = ({ item }) => (
    <View style={[styles.eventItem, { borderLeftColor: item.color }]}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventTime}>{item.time}</Text>
      </View>
      <Text style={styles.eventLocation}>{item.location}</Text>
    </View>
  );

  const renderTabBar = () => {
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab("calendar")}
        >
          <View style={[styles.tabIcon, styles.activeTabIcon]}>
            <Text style={styles.tabIconText}>📅</Text>
          </View>
          <Text style={[styles.tabText, styles.activeTabText]}>Календар</Text>
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
          <View style={styles.tabIcon}>
            <Text style={styles.tabIconText}>🎮</Text>
          </View>
          <Text style={styles.tabText}>Игри</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab("career")}
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

      {/* Month Navigation */}
      <View style={styles.monthNavigation}>
        <TouchableOpacity onPress={() => navigateMonth("prev")}>
          <Text style={styles.navArrow}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthYearText}>
          {monthNames[selectedMonth]} {selectedYear}
        </Text>
        <TouchableOpacity onPress={() => navigateMonth("next")}>
          <Text style={styles.navArrow}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Week Days Header */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <Text key={index} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarContainer}>
        <FlatList
          data={days}
          renderItem={renderDateItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={7}
          scrollEnabled={false}
        />
      </View>

      {/* Events Section */}
      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>
          Събития за {selectedDate.getDate()}{" "}
          {monthNames[selectedDate.getMonth()]}
        </Text>
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.eventsList}
          showsVerticalScrollIndicator={false}
        />
      </View>

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
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 15,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  navArrow: {
    fontSize: 18,
    color: "#614EC1",
    fontWeight: "bold",
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    marginHorizontal: 20,
  },
  weekDayText: {
    fontSize: 14,
    color: "#8E8E93",
    width: 30,
    textAlign: "center",
  },
  calendarContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dateItem: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 20,
  },
  emptyDate: {
    width: 40,
    height: 40,
    margin: 2,
  },
  dateText: {
    fontSize: 16,
    color: "#000000",
  },
  selectedDate: {
    backgroundColor: "#614EC1",
  },
  selectedDateText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  todayDate: {
    borderWidth: 1,
    borderColor: "#614EC1",
  },
  todayDateText: {
    color: "#614EC1",
    fontWeight: "bold",
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000000",
  },
  eventsList: {
    paddingBottom: 20,
  },
  eventItem: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  eventTime: {
    fontSize: 14,
    color: "#8E8E93",
  },
  eventLocation: {
    fontSize: 14,
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

export default CalendarScreen;
