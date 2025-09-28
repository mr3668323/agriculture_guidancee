"use client"

import React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  StatusBar,
} from "react-native"

const { width, height } = Dimensions.get("window")
const BACKGROUND_URI =
  "https://images.pexels.com/photos/1443867/pexels-photo-1443867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"

const StartingPage = ({ navigation }) => {
  return (
    <ImageBackground
      source={{ uri: BACKGROUND_URI }}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View pointerEvents="none" style={styles.overlay} />
        <View style={styles.container}>
          <View style={styles.brandingDirect}>
            <View style={styles.badgeDirect}>
              <Text style={styles.badgeTextDirect}>Welcome!</Text>
            </View>
            <Text style={styles.headerTitleDirect}>AGRI-SMART HUB!</Text>
            <Text style={styles.subtitleDirect}>
              The best app for your plants
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cylinderButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("SignIn")}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cylinderButton, styles.signupButton]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImageStyle: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(47,82,51,0.58)",
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  brandingDirect: {
    alignItems: "center",
    marginTop: height * 0.13,
    marginBottom: height * 0.08,
  },
  badgeDirect: {
    alignSelf: "center",
    backgroundColor: "rgba(71, 133, 85, 0.55)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 12,
  },
  badgeTextDirect: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000ff",
    letterSpacing: 0.8,
  },
  headerTitleDirect: {
    fontSize: 34,
    fontWeight: "900",
    color: "#003c01ff",
    marginBottom: 8,
    textShadowColor: "rgba(47,82,51,0.45)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
    textAlign: "center",
  },
  subtitleDirect: {
    fontSize: 18,
    lineHeight: 26,
    color: "#000000ff",
    textShadowColor: "rgba(47,82,51,0.25)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 8,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: height * 0.10,
  },
  cylinderButton: {
    width: "85%",
    paddingVertical: 16,
    borderRadius: 30,
    backgroundColor: "#2f5233",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#000000ff",
    fontSize: 19,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  signupButton: {
    backgroundColor: "rgba(255,255,255,0.10)",
    marginBottom: 0,
  },
  signupText: {
    color: "#000000ff",
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
})

export default StartingPage