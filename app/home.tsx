import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  PanResponder,
  StatusBar,
  ScrollView,
} from "react-native";
import { bgColor } from "./assets/colors";
import HomeLearnCategories from "./components/HomeLearnCategories";
import { useRouter } from "expo-router"; // Added useRouter for navigation
import SelectOption from "./components/SelectOptions";
import MenuCard from "./components/MenuCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { languageOptions } from "./services/base";
import { flags } from "./base";
import { useUser } from "@clerk/clerk-expo";
import i18n from "i18next";
import { initI18n } from "./services/initI18n";
initI18n();

const HomeScreen = () => {
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    i18n.language in flags ? i18n.language : "de"
  );
  const slideAnimation = useRef(new Animated.Value(-300)).current;
  const isWeb = Platform.OS === "web";
  console.log(user?.emailAddresses[0].emailAddress);
  // PanResponder for side menu
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > 20,
    onPanResponderMove: (_, gestureState) => {
      const translateX = Math.max(-300, Math.min(0, gestureState.dx - 300));
      slideAnimation.setValue(translateX);
    },
  });

  // Change language
  const handleChangeLanguage = (language: string) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={bgColor} />
      <View style={styles.header}>
        <Image
          source={require("./assets/logo7.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.profileContainer}>
          <SelectOption
            options={languageOptions}
            selectedValue={selectedLanguage}
            onValueChange={handleChangeLanguage}
          />
          {Platform.OS === "web" && (
            <TouchableOpacity
              onPress={() => router.push("/profile")} // Use router.push for navigation
            >
              <Image
                source={require("./assets/user.png")}
                style={styles.user}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Background Image (only for non-small screens) */}

      <Image
        source={require("./assets/street.png")}
        style={styles.backgroundStreet}
        resizeMode="cover"
      />
      {Platform.OS !== "web" && <HomeLearnCategories />}
      {/* Main Content Section */}
      <View
        style={[
          styles.mainContent,
          Platform.OS != "web" && styles.mainContentSmall,
        ]}
      >
        <MenuCard
          sideColor={"#007bff"}
          icon={require("./assets/bookmark.png")}
          title={"Bookmarks"}
          route={() => router.push("/bookmarks")} // Use router.push for navigation
          isWeb={isWeb}
        />
        <MenuCard
          sideColor={"#f72d00"}
          icon={require("./assets/road-sign.png")}
          title={"trafficSigns"}
          route={() => router.push("/trafficsigns")} // Use router.push for navigation
          isWeb={isWeb}
        />
        <MenuCard
          sideColor={"#00e31a"}
          icon={require("./assets/book.png")}
          title={"commonWords"}
          route={() => router.push("/commonwords")} // Use router.push for navigation
          isWeb={isWeb}
        />

        <MenuCard
          sideColor={"#9f00a2"}
          icon={require("./assets/study.png")}
          title={"learn"}
          route={() => router.push("/learn")} // Use router.push for navigation
          isWeb={isWeb}
        />
        <MenuCard
          sideColor={"#ff9100"}
          icon={require("./assets/quiz.png")}
          title={"quiz"}
          route={() => router.push("/question")} // Use router.push for navigation
          isWeb={isWeb}
        />
        <MenuCard
          sideColor={"#ff00e1"}
          icon={require("./assets/deadline.png")}
          title={"exam"}
          route={() =>
            router.push({ pathname: "/question", params: { isExam: true } })
          }
          isWeb={isWeb}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bgColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Platform.OS === "web" ? "#ffffff" : "transparent",
    paddingHorizontal: 16,
    paddingVertical: 5,
    gap: 0,
  },
  logo: { height: 40, width: 100 },
  user: { height: 50, width: 50 },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: Platform.OS !== "web" ? 20 : 100,
  },
  backgroundStreet: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  mainContent: {
    flex: 1,
    maxHeight: "40%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 10,
    gap: 20,
  },
  mainContentSmall: { paddingHorizontal: 5, gap: 15 },
});

export default HomeScreen;
