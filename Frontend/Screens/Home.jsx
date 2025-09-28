"use client"

import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Easing,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native"

const { width, height } = Dimensions.get("window")
const AGRI_BACKGROUND_URI =
  "https://images.pexels.com/photos/1443867/pexels-photo-1443867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"

const Home = ({ navigation }) => {
  const spinValue = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start()
  }, [spinValue])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  const handleSignOut = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    })
  }

  const navigateToFeature = (featureName) => {
    if (featureName === "Crop Detection") {
      navigation.navigate("CropIdentificationScreen")
    } else if (featureName === "Crop Guidance") {
      navigation.navigate("CropGuidanceScreen")
    } else if (featureName === "Disease Info") {
      navigation.navigate("DiseaseInfoScreen")
    } else if (featureName === "Marketplace") {
      navigation.navigate("MarketplaceScreen")
    } else if (featureName === "Chatbot") {
      navigation.navigate("ChatbotScreen")
    } else if (featureName === "Fruits Growth Stages") {
      navigation.navigate("FruitsGrowthStagesScreen")
    }
  }

  const features = [
    {
      name: "Crop Detection",
      imageUrl:
        "https://media.licdn.com/dms/image/v2/C5612AQEwvpWfI8JDnQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1605098517417?e=2147483647&v=beta&t=fL1jG3MM8qoaX5ihQEhcJXn-Y2-QoYsuc33GWOA094s",
    },
    {
      name: "Crop Guidance",
      imageUrl:
        "https://media.istockphoto.com/id/965148388/photo/green-ripening-soybean-field-agricultural-landscape.jpg?s=612x612&w=0&k=20&c=cEVP3uj34-5obt-Jf_WI3O9qfP6tVrFaQIv1rBvvpzc=",
    },
    {
      name: "Disease Info",
      imageUrl:
        "https://media.istockphoto.com/id/1286441510/photo/septoria-leaf-spot-on-tomato-damaged-by-disease-and-pests-of-tomato-leaves.jpg?s=612x612&w=0&k=20&c=xbj5UwBoQO3LYWj1eFdt9InBTOqq-e50pq9V3TxD5Cw=",
    },
    {
      name: "Marketplace",
      imageUrl: "https://www.shutterstock.com/image-photo/dollar-money-bag-on-farm-260nw-2036599517.jpg",
    },
    {
      name: "Chatbot",
      imageUrl:
        "data:image/jpeg;base64,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",
    },
    {
      name: "Fruits Growth Stages",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR27FUb-9oyM91DMdlLzqWkCsCQzHdiFd_3qg&s",
    },
  ]

  return (
    <ImageBackground
      source={{ uri: AGRI_BACKGROUND_URI }}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View pointerEvents="none" style={styles.overlay} />
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.brandingDirect}>
            <Animated.Image
              style={[styles.logo, { transform: [{ rotate: spin }] }]}
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/4740/4740528.png" }}
            />
            <Text style={styles.headerTitleDirect}>AGRI-SMART HUB!</Text>
            <Text style={styles.subtitleDirect}>Your Farming Companion</Text>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.7}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          {/* First row: Crop Detection & Crop Guidance */}
          <View style={styles.featuresRow}>
            {features.slice(0, 2).map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={styles.featureCardHorizontal}
                onPress={() => navigateToFeature(feature.name)}
                activeOpacity={0.85}
              >
                <Image source={{ uri: feature.imageUrl }} style={styles.featureImageHorizontal} resizeMode="cover" />
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureText}>{feature.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {/* Second row: Disease Info & Marketplace */}
          <View style={styles.featuresRow}>
            {features.slice(2, 4).map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={styles.featureCardHorizontal}
                onPress={() => navigateToFeature(feature.name)}
                activeOpacity={0.85}
              >
                <Image source={{ uri: feature.imageUrl }} style={styles.featureImageHorizontal} resizeMode="cover" />
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureText}>{feature.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {/* Third row: Chatbot & Fruits Growth Stages */}
          <View style={styles.featuresRow}>
            {features.slice(4, 6).map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={styles.featureCardHorizontal}
                onPress={() => navigateToFeature(feature.name)}
                activeOpacity={0.85}
              >
                <Image source={{ uri: feature.imageUrl }} style={styles.featureImageHorizontal} resizeMode="cover" />
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureText}>{feature.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 30,
    justifyContent: "flex-end",
  },
  brandingDirect: {
    marginTop: 18,
    marginBottom: 18,
    alignItems: "center",
    paddingHorizontal: 2,
    position: "relative",
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  headerTitleDirect: {
    fontSize: 34,
    fontWeight: "900",
    color: "#003c01ff",
    marginBottom: 4,
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
  signOutButton: {
    backgroundColor: "#2f5233",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 2,
    marginTop: 8,
    alignSelf: "center",
  },
  signOutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  featureCardHorizontal: {
    width: width * 0.42,
    backgroundColor: "rgba(53, 90, 48, 0.45)",
    borderRadius: 16,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(47,82,51,0.12)",
  },
  featureImageHorizontal: {
    width: "100%",
    height: 110,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  featureTextContainer: {
    padding: 10,
    minHeight: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  featureText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000ff",
    textAlign: "center",
    zIndex: 1,
    letterSpacing: 0.5,
  },
})

export default Home