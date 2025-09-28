"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import axios from "axios"
import { BACKEND_URL } from "@env"

const { width, height } = Dimensions.get("window")
const BASE_URL = BACKEND_URL
const AGRI_BACKGROUND_URI =
  "https://images.pexels.com/photos/1443867/pexels-photo-1443867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"

const SignIn = ({ navigation, route }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fadeAnim = useState(new Animated.Value(0))[0]
  const slideAnim = useState(new Animated.Value(40))[0]

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email)
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [route.params?.email, fadeAnim, slideAnim])

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const handleSignIn = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.")
      return
    }

    if (password.length === 0) {
      Alert.alert("Validation Error", "Please enter your password.")
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signin`, {
        email,
        password,
      })

      Alert.alert("Login Successful", response.data.msg || "You have been logged in successfully!", [
        {
          text: "Continue",
          onPress: () => navigation.navigate("Home"),
        },
      ])
    } catch (error) {
      console.log("SIGNIN API Error:", error.message)
      console.warn("SIGNIN API Error:", error.response?.data || error.message)

      let errorMessage = "An unexpected error occurred. Please try again."

      if (error.response) {
        if (error.response.status === 400 && error.config.url.includes("/api/auth/signin")) {
          errorMessage = "Wrong password, please enter the correct password."
        } else if (error.response.data && (error.response.data.msg || error.response.data.message)) {
          errorMessage = error.response.data.msg || error.response.data.message
        } else if (error.response.data?.msg === "User not found") {
          errorMessage = "This email is not registered."
        } else if (error.response.data?.msg === "Incorrect password") {
          errorMessage = "Wrong password, please enter the correct password."
        } else if (typeof error.response.data === "string" && error.response.data.length > 0) {
          errorMessage = error.response.data
        } else {
          errorMessage = error.message || `Request failed with status ${error.response.status}.`
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your network connection or if the backend server is running."
      } else {
        errorMessage = error.message
      }

      Alert.alert("Login Failed", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ImageBackground
      source={{ uri: AGRI_BACKGROUND_URI }}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View pointerEvents="none" style={styles.overlay} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <View style={styles.brandingDirect}>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              <View style={styles.badgeDirect}>
                <Text style={styles.badgeTextDirect}>Welcome!</Text>
              </View>
              <Text style={styles.headerTitleDirect}>AGRI-SMART HUB!</Text>
              <Text style={styles.subtitleDirect}>
                Cultivate smarter harvests with data-driven insights tailored for every acre you steward.
              </Text>
              <View style={styles.featureRowDirect}>
                <View style={styles.featurePillDirect}>
                  <MaterialCommunityIcons name="sprout-outline" size={16} color="#000" />
                  <Text style={styles.featureTextDirect}>Community</Text>
                </View>
                <View style={styles.featurePillDirect}>
                  <MaterialCommunityIcons name="weather-sunny" size={16} color="#000" />
                  <Text style={styles.featureTextDirect}>Secure Data</Text>
                </View>
              </View>
            </Animated.View>
          </View>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            <View style={styles.lowerContainer}>
              <Animated.View
                style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
              >
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="email-outline" size={18} color="#000" />
                    <Text style={styles.inputLabel}>Email Address</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="rgba(43,43,43,0.45)"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="lock-outline" size={18} color="#000" />
                    <Text style={styles.inputLabel}>Password</Text>
                  </View>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      placeholderTextColor="rgba(43,43,43,0.45)"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#2b2b2b" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.forgotPasswordButton} activeOpacity={0.7}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.signInButton, isLoading && styles.disabledButton]}
                  onPress={handleSignIn}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.signInButtonText}>Sign In</Text>
                      <Ionicons name="arrow-forward" size={28} color="#000" />
                    </>
                  )}
                </TouchableOpacity>

                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Don't have an account?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("SignUp")} activeOpacity={0.7}>
                    <Text style={styles.signUpLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
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
  keyboardContainer: {
    flex: 1,
  },
  brandingDirect: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "flex-start",
    paddingHorizontal: 2,
  },
  badgeDirect: {
    alignSelf: "flex-start",
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
  },
  subtitleDirect: {
    fontSize: 18,
    lineHeight: 26,
    color: "#000000ff",
    textShadowColor: "rgba(47,82,51,0.25)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  featureRowDirect: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 10,
  },
  featurePillDirect: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(47,82,51,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    marginRight: 10,
  },
  featureTextDirect: {
    fontSize: 15,
    color: "#000000ff",
    fontWeight: "600",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 56,
    justifyContent: "flex-end",
  },
  lowerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    minHeight: height * 0.55,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "rgba(53, 90, 48, 0.45)",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#2b2b2b",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(47,82,51,0.12)",
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 19,
    fontWeight: "600",
    color: "#000000ff",
    marginLeft: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "rgba(47,82,51,0.16)",
    borderRadius: 12,
    backgroundColor: "rgba(248,243,235,0.45)",
  },
  input: {
    padding: 15,
    fontSize: 16,
    color: "#030101ff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(47,82,51,0.16)",
    borderRadius: 12,
    backgroundColor: "rgba(248,243,235,0.45)",
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: "#000000ff",
  },
  eyeIcon: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#000000ff",
    fontWeight: "700",
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: "#2f5233",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#2f5233",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: "#000000ff",
    fontWeight: "700",
    fontSize: 16,
    marginRight: 8,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 17,
  },
  signUpLink: {
    color: "#000000ff",
    fontWeight: "700",
    fontSize: 17,
    marginLeft: 6,
  },
})

export default SignIn