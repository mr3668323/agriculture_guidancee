"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Alert,
  StyleSheet
} from "react-native";
import * as ImagePicker from "expo-image-picker"
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

const CropIdentificationScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [identificationResults, setIdentificationResults] = useState(null)
  const scrollViewRef = useRef(null)

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "You need to grant camera roll permissions to upload images.")
        return
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri)
        setIdentificationResults(null)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image: " + error.message)
    }
  }

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "You need to grant camera permissions to take photos.")
        return
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri)
        setIdentificationResults(null)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo: " + error.message)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select or take a photo first.")
      return
    }
    try {
      setIsAnalyzing(true)

      const formData = new FormData()
      formData.append("image", {
        uri: selectedImage,
        name: "crop.jpg",
        type: "image/jpeg",
      })

      const response = await fetch("http://192.168.100.195:5000/api/detect-crop", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })

      const result = await response.json()

      if (response.ok) {
        const identifiedCrop = {
          id: 999,
          name: result.crop,
          scientificName: result.scientificName || " ",
          confidence: result.confidence || 0,
          description: result.description || "Description not available.",
          characteristics: result.characteristics?.length
            ? result.characteristics
            : ["No characteristics available."],
          imageUrls: result.imageUrls?.length
            ? result.imageUrls
            : ["https://via.placeholder.com/150"],
        }
        setIdentificationResults(identifiedCrop)

        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      } else {
        Alert.alert("Prediction Failed", result.error || "An error occurred during prediction.")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to analyze image: " + error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetIdentification = () => {
    setSelectedImage(null)
    setIdentificationResults(null)
  }

  const renderConfidenceBar = (confidence) => {
    const percentage = confidence * 100
    let color = "#4CAF50"
    if (percentage < 70) {
      color = "#F44336"
    } else if (percentage < 85) {
      color = "#FFC107"
    }
    return (
      <View style={{ marginVertical: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 4 }}>{`Confidence: ${percentage.toFixed(1)}%`}</Text>
        <View style={{ width: "100%", height: 8, backgroundColor: "#ddd", borderRadius: 4 }}>
          <View style={{ width: `${percentage}%`, height: 8, backgroundColor: color, borderRadius: 4 }} />
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#388e3c" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#388e3c" }}>Crop Identification</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Image Section */}
        <View style={{ alignItems: "center", marginVertical: 15 }}>
          {selectedImage ? (
            <View>
              <Image source={{ uri: selectedImage }} style={{ width: width * 0.9, height: 200, borderRadius: 10 }} resizeMode="cover" />
              <TouchableOpacity
                style={{ position: "absolute", top: 10, right: 10, backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 15 }}
                onPress={resetIdentification}
              >
                <Ionicons name="close-circle" size={28} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <MaterialCommunityIcons name="image-plus" size={80} color="#388e3c" />
              <Text style={{ fontSize: 14, color: "#666", marginTop: 5 }}>Upload or take a photo of a crop to identify</Text>
            </View>
          )}
        </View>

        {/* Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 10 }}>
          <TouchableOpacity style={{ backgroundColor: "#388e3c", padding: 10, borderRadius: 8, flexDirection: "row", alignItems: "center" }} onPress={pickImage}>
            <Ionicons name="images" size={20} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 5 }}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: "#388e3c", padding: 10, borderRadius: 8, flexDirection: "row", alignItems: "center" }} onPress={takePhoto}>
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 5 }}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: (!selectedImage || isAnalyzing) ? "#aaa" : "#388e3c", padding: 10, borderRadius: 8, flexDirection: "row", alignItems: "center" }}
            onPress={analyzeImage}
            disabled={!selectedImage || isAnalyzing}
          >
            {isAnalyzing ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="scan" size={20} color="#fff" />}
            <Text style={{ color: "#fff", marginLeft: 5 }}>Identify</Text>
          </TouchableOpacity>
        </View>

        {/* Analyzing Indicator */}
        {isAnalyzing && (
          <View style={{ alignItems: "center", marginVertical: 20 }}>
            <ActivityIndicator size="large" color="#388e3c" />
            <Text style={{ marginTop: 10, fontSize: 14, color: "#666" }}>Analyzing crop image...</Text>
          </View>
        )}

        {/* Results */}
        {identificationResults && (
          <View style={{ padding: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Identification Results</Text>
            <View style={{ backgroundColor: "#f5f5f5", padding: 15, borderRadius: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#388e3c" }}>{identificationResults.name}</Text>
              <Text style={{ fontStyle: "italic", fontSize: 14, color: "#666" }}>{identificationResults.scientificName}</Text>

              {/* Multiple Images */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
                {identificationResults.imageUrls.map((imgUrl, idx) => (
                  <Image key={idx} source={{ uri: imgUrl }} style={{ width: 120, height: 100, borderRadius: 8, marginRight: 10 }} />
                ))}
              </ScrollView>

              {renderConfidenceBar(identificationResults.confidence)}

              <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}>Description</Text>
              <Text style={{ fontSize: 14, marginBottom: 10 }}>{identificationResults.description}</Text>

              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Characteristics</Text>
              {identificationResults.characteristics.map((charac, index) => (
                <View key={index} style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <FontAwesome5 name="leaf" size={14} color="#388e3c" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 14 }}>{charac}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f8ea",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#388e3c",
  },
  placeholder: {
    width: 40,
  },
  imageSection: {
    width: "100%",
    height: 250,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderText: {
    marginTop: 10,
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },
  selectedImageContainer: {
    flex: 1,
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
  },
  resetButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  galleryButton: {
    backgroundColor: "#5c6bc0",
  },
  cameraButton: {
    backgroundColor: "#26a69a",
  },
  analyzeButton: {
    backgroundColor: "#388e3c",
  },
  disabledButton: {
    backgroundColor: "#a5d6a7",
    opacity: 0.7,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
  analyzingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  analyzingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#388e3c",
    fontWeight: "500",
  },
  resultsContainer: {
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388e3c",
    marginBottom: 15,
  },
  cropCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cropHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  cropTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  cropName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  scientificName: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginTop: 4,
  },
  cropImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  confidenceContainer: {
    marginBottom: 15,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#555",
  },
  confidenceBarBackground: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  confidenceBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 15,
  },
  characteristicsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 8,
  },
  characteristicsList: {
    marginBottom: 15,
  },
  characteristicItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  characteristicText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
  moreInfoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f8ea",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  moreInfoButtonText: {
    color: "#388e3c",
    fontWeight: "600",
    marginRight: 5,
  },
})

export default CropIdentificationScreen
