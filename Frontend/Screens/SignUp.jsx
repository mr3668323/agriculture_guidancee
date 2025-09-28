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
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons"
import axios from "axios"
import { BACKEND_URL } from "@env"

const { width, height } = Dimensions.get("window")
const BASE_URL = BACKEND_URL
const AGRI_BACKGROUND_URI =
  "https://images.pexels.com/photos/1443867/pexels-photo-1443867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"

const SignUp = ({ navigation }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fadeAnim = useState(new Animated.Value(0))[0]
  const slideAnim = useState(new Animated.Value(40))[0]

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")

  useEffect(() => {
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

    checkPasswordStrength(password)
  }, [password])

  const checkPasswordStrength = (pass) => {
    if (!pass) {
      setPasswordStrength(0)
      setPasswordFeedback("")
      return
    }
    let strength = 0
    if (pass.length >= 8) strength += 1
    if (/[A-Z]/.test(pass)) strength += 1
    if (/[0-9]/.test(pass)) strength += 1
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1
    setPasswordStrength(strength)
    if (strength === 0) setPasswordFeedback("Very weak")
    else if (strength === 1) setPasswordFeedback("Weak")
    else if (strength === 2) setPasswordFeedback("Medium")
    else if (strength === 3) setPasswordFeedback("Strong")
    else setPasswordFeedback("Very strong")
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSignUp = async () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your full name.")
      return
    }
    if (!validateEmail(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.")
      return
    }
    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters long.")
      return
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.")
      return
    }
    setIsLoading(true)
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, {
        username: name,
        email,
        password,
      })
      Alert.alert(
        "Registration Successful",
        response.data.msg || "Your account has been created successfully. Please sign in.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("SignIn", { email }),
          },
        ]
      )
    } catch (error) {
      console.error("API Error:", error)
      let errorMessage = "An unexpected error occurred. Please try again."
      if (error.response) {
        if (error.response.data && error.response.data.msg) {
          errorMessage = error.response.data.msg
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (typeof error.response.data === "string") {
          errorMessage = error.response.data
        } else {
          errorMessage = error.response.statusText || `Request failed with status ${error.response.status}`
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your network connection or if the backend server is running."
      } else {
        errorMessage = error.message
      }
      Alert.alert("Registration Failed", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "#e53935"
    if (passwordStrength === 1) return "#ffb300"
    if (passwordStrength === 2) return "#fdd835"
    if (passwordStrength === 3) return "#7cb342"
    return "#43a047"
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
                <Text style={styles.badgeTextDirect}>Join Us!</Text>
              </View>
              <Text style={styles.headerTitleDirect}>AGRI-SMART HUB!</Text>
              <Text style={styles.subtitleDirect}>
                Register to unlock smart farming features and community support.
              </Text>
              <View style={styles.featureRowDirect}>
                <View style={styles.featurePillDirect}>
                  <MaterialCommunityIcons name="account-group-outline" size={16} color="#000" />
                  <Text style={styles.featureTextDirect}>Community</Text>
                </View>
                <View style={styles.featurePillDirect}>
                  <MaterialCommunityIcons name="shield-check" size={16} color="#000" />
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
                    <FontAwesome5 name="user" size={18} color="#000" />
                    <Text style={styles.inputLabel}>Full Name</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      placeholderTextColor="rgba(43,43,43,0.45)"
                    />
                  </View>
                </View>

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
                      placeholder="Create a password"
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
                  {password.length > 0 && (
                    <View style={styles.strengthContainer}>
                      <View style={styles.strengthBars}>
                        {[0, 1, 2, 3].map((index) => (
                          <View
                            key={index}
                            style={[
                              styles.strengthBar,
                              {
                                backgroundColor: index < passwordStrength ? getStrengthColor() : "#e0e0e0",
                                width: `${100 / 4 - 2}%`,
                              },
                            ]}
                          />
                        ))}
                      </View>
                      <Text style={[styles.strengthText, { color: getStrengthColor() }]}>{passwordFeedback}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MaterialCommunityIcons name="lock-check-outline" size={18} color="#000" />
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                  </View>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      placeholderTextColor="rgba(43,43,43,0.45)"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#2b2b2b" />
                    </TouchableOpacity>
                  </View>
                  {confirmPassword.length > 0 && (
                    <View style={styles.passwordMatchContainer}>
                      <Ionicons
                        name={password === confirmPassword ? "checkmark-circle" : "close-circle"}
                        size={16}
                        color={password === confirmPassword ? "#43a047" : "#e53935"}
                      />
                      <Text
                        style={[styles.passwordMatchText, { color: password === confirmPassword ? "#43a047" : "#e53935" }]}
                      >
                        {password === confirmPassword ? "Passwords match" : "Passwords don't match"}
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.signUpButton, isLoading && styles.disabledButton]}
                  onPress={handleSignUp}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.signUpButtonText}>Create Account</Text>
                      <Ionicons name="arrow-forward" size={28} color="#000" />
                    </>
                  )}
                </TouchableOpacity>

                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    By signing up, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </View>

                <View style={styles.signInContainer}>
                  <Text style={styles.signInText}>Already have an account?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("SignIn")} activeOpacity={0.7}>
                    <Text style={styles.signInLink}>Sign In</Text>
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
  strengthContainer: {
    marginTop: 8,
  },
  strengthBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    textAlign: "right",
  },
  passwordMatchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  passwordMatchText: {
    fontSize: 12,
    marginLeft: 5,
  },
  signUpButton: {
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
  signUpButtonText: {
    color: "#000000ff",
    fontWeight: "700",
    fontSize: 16,
    marginRight: 8,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: "#000000ff",
    textAlign: "center",
    lineHeight: 18,
    fontWeight: "bold",
  },
  termsLink: {
    color: "#000000ff",
    fontWeight: "bold",
    fontWeight: "bold",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    color: "rgba(0, 0, 0, 1)",
    fontWeight: "bold",
    fontSize: 19,
  },
  signInLink: {
    color: "#000000ff",
    fontWeight: "700",
    fontSize: 17,
    marginLeft: 6,
  },
})

export default SignUp