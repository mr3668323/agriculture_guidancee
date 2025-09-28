"use client";

import * as Speech from "expo-speech";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  TextInput,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";


const { width } = Dimensions.get("window");

// Dummy data for crop diseases (unchanged)
const diseaseData = [
  {
    id: 1,
    name: "Wheat Rust",
    scientificName: "Puccinia graminis",
    affectedCrop: "Wheat",
    symptoms:
      "Reddish-brown pustules on stems and leaves, reduced grain quality and yield.",
    causes: "Fungal infection spread by spores through wind and rain.",
    prevention: [
      "Plant resistant varieties",
      "Crop rotation",
      "Fungicide application",
      "Early planting",
    ],
    treatment: [
      "Apply fungicides like tebuconazole or propiconazole",
      "Remove infected plants",
      "Maintain field hygiene",
    ],
    imageUrl:
      "https://media.istockphoto.com/id/1286441510/photo/septoria-leaf-spot-on-tomato-damaged-by-disease-and-pests-of-tomato-leaves.jpg?s=612x612&w=0&k=20&c=xbj5UwBoQO3LYWj1eFdt9InBTOqq-e50pq9V3TxD5Cw=",
  },
  {
    id: 2,
    name: "Rice Blast",
    scientificName: "Magnaporthe oryzae",
    affectedCrop: "Rice",
    symptoms:
      "Diamond-shaped lesions on leaves, infected panicles turn white and fail to produce grain.",
    causes: "Fungal infection favored by high humidity and temperatures.",
    prevention: [
      "Use resistant varieties",
      "Balanced fertilization",
      "Proper water management",
      "Seed treatment",
    ],
    treatment: [
      "Apply fungicides like tricyclazole or isoprothiolane",
      "Drain fields to reduce humidity",
      "Remove and destroy infected plants",
    ],
    imageUrl:
      "https://media.istockphoto.com/id/1286441510/photo/septoria-leaf-spot-on-tomato-damaged-by-disease-and-pests-of-tomato-leaves.jpg?s=612x612&w=0&k=20&c=xbj5UwBoQO3LYWj1eFdt9InBTOqq-e50pq9V3TxD5Cw=",
  },
  {
    id: 3,
    name: "Cotton Leaf Curl Virus",
    scientificName: "Cotton leaf curl virus (CLCuV)",
    affectedCrop: "Cotton",
    symptoms: "Upward curling of leaves, thickened veins, and stunted growth.",
    causes: "Virus transmitted by whitefly (Bemisia tabaci).",
    prevention: [
      "Plant resistant varieties",
      "Control whitefly population",
      "Early sowing",
      "Crop rotation",
    ],
    treatment: [
      "No direct cure for viral infections",
      "Remove and destroy infected plants",
      "Control whitefly vectors with insecticides",
      "Maintain field hygiene",
    ],
    imageUrl:
      "https://media.istockphoto.com/id/1286441510/photo/septoria-leaf-spot-on-tomato-damaged-by-disease-and-pests-of-tomato-leaves.jpg?s=612x612&w=0&k=20&c=xbj5UwBoQO3LYWj1eFdt9InBTOqq-e50pq9V3TxD5Cw=",
  },
];

const DiseaseInfoScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedDisease, setDetectedDisease] = useState(null);

  const filteredDiseases = diseaseData.filter(
    (disease) =>
      disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.affectedCrop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Image picker from gallery
  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "You need to grant camera roll permissions to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setDetectedDisease(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image: " + error.message);
    }
  };

  // Camera capture
  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "You need to grant camera permissions to take photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setDetectedDisease(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo: " + error.message);
    }
  };

// Replace your analyzeImage function with this new one
const analyzeImage = async () => {
  if (!selectedImage) {
    Alert.alert("No Image", "Please select or take a photo first.");
    return;
  }

  setIsAnalyzing(true);
  setDetectedDisease(null);

  try {
    const uriParts = selectedImage.split(".");
    const fileExtension = uriParts[uriParts.length - 1].toLowerCase();

    const formData = new FormData();
    formData.append("image", {
      uri: selectedImage,
      name: `photo.${fileExtension || "jpg"}`,
      type: `image/${fileExtension === "jpg" ? "jpeg" : fileExtension || "jpeg"}`,
    });

    // USE EXPRESS BACKEND — NOT FLASK
    const API_URL = "http://192.168.100.195:5000/api/detect-disease";

    const res = await fetch(API_URL, { method: "POST", body: formData });

    const raw = await res.text(); // Read as text to catch HTML errors
    let json;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      Alert.alert(
        "Server Error",
        `Expected JSON but got HTML.\nCheck API URL or server logs.\nPreview:\n${raw.slice(0, 200)}`
      );
      return;
    }

    // Normalize both Express + Flask keys
    setDetectedDisease({
      name: json.disease || json.disease_name || "Unknown Disease",
      scientificName: json.scientificName || " ",
      affectedCrop: json.affectedCrop || json.affected_crop || "Unknown crop",
      symptoms:
        Array.isArray(json.symptoms) && json.symptoms.length
          ? json.symptoms
          : ["No data found"],
      causes:
        Array.isArray(json.causes) && json.causes.length
          ? json.causes
          : ["No data found"],
      prevention:
        Array.isArray(json.prevention) && json.prevention.length
          ? json.prevention
          : ["No data found"],
      treatment:
        Array.isArray(json.treatment) && json.treatment.length
          ? json.treatment
          : ["No data found"],
    });
  } catch (error) {
    Alert.alert("Error", error.message);
    setDetectedDisease(null);
  } finally {
    setIsAnalyzing(false);
  }
};



  const resetDetection = () => {
    setSelectedImage(null);
    setDetectedDisease(null);
  };


// ---- Text-to-Speech Helpers ----
const buildDiseaseNarration = (d) => {
  if (!d) return "";

  const toSentence = (val) =>
    Array.isArray(val) ? val.filter(Boolean).join(". ") : (val || "");

  const scrub = (txt) =>
    (txt || "")
      .replace(/\bNo data found\b/gi, "")
      .replace(/\bNo specific .* found online\.\b/gi, "")
      .trim();

  const parts = [
    d.name ? `${d.name}.` : "",
    //d.scientificName ? `Scientific name: ${d.scientificName}.` : "",
    d.affectedCrop ? `Affected crop: ${d.affectedCrop}.` : "",
    `Symptoms: ${toSentence(d.symptoms) || "Not available."}.`,
    `Causes: ${toSentence(d.causes) || "Not available."}.`,
    `Prevention: ${toSentence(d.prevention) || "Not available."}.`,
    `Treatment: ${toSentence(d.treatment) || "Not available."}.`,
  ];

  return scrub(parts.filter(Boolean).join(" "));
};

const chunkText = (text, maxLen = 1600) => {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + maxLen, text.length);
    if (end < text.length) {
      const dot = text.lastIndexOf(".", end);
      if (dot > start + 200) end = dot + 1;
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks.filter(Boolean);
};

const speakDiseaseInfo = async () => {
  const d = selectedDisease || detectedDisease;
  if (!d) {
    Alert.alert("Nothing to read", "Open a disease first.");
    return;
  }

  const text = buildDiseaseNarration(d);
  if (!text) {
    Alert.alert("No details", "There’s no text to read yet.");
    return;
  }

  // Stop ongoing speech first
  const speaking = await Speech.isSpeakingAsync();
  if (speaking) {
    Speech.stop();
    return;
  }

  // Break into smaller chunks (to avoid truncation)
  const chunks = chunkText(text);
  let i = 0;

  const speakNext = () => {
    if (i >= chunks.length) return;

    Speech.speak(chunks[i], {
      language: "en",
      rate: 0.95, // slower pace for clarity
      pitch: 1.0,
      onDone: () => {
        i += 1;
        speakNext();
      },
      onError: (err) => {
        console.error("Speech error:", err);
        Alert.alert("Speech Error", err.message || "Unknown error");
      }
    });
  };

  speakNext();
};


  const renderDiseaseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.diseaseCard}
      onPress={() => setSelectedDisease(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.diseaseImage} resizeMode="cover" />
      <View style={styles.diseaseCardContent}>
        <Text style={styles.diseaseName}>{item.name}</Text>
        <View style={styles.diseaseCardFooter}>
          <View style={styles.diseaseCardTag}>
            <Text style={styles.diseaseCardTagText}>{item.affectedCrop}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#d32f2f" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#d32f2f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disease Information</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedDisease === null && !selectedImage ? styles.tabButtonActive : null,
          ]}
          onPress={() => {
            setSelectedDisease(null);
            setSelectedImage(null);
            setDetectedDisease(null);
          }}
        >
          <Text
            style={[
              styles.tabButtonText,
              selectedDisease === null && !selectedImage ? styles.tabButtonTextActive : null,
            ]}
          >
            Browse Diseases
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedImage !== null ? styles.tabButtonActive : null]}
          onPress={() => {
            setSelectedDisease(null);
            if (!selectedImage) {
              Alert.alert("Disease Detection", "Would you like to take a photo or choose from gallery?", [
                { text: "Cancel", style: "cancel" },
                { text: "Take Photo", onPress: takePhoto },
                { text: "Choose Photo", onPress: pickImage },
              ]);
            }
          }}
        >
          <Text style={[styles.tabButtonText, selectedImage !== null ? styles.tabButtonTextActive : null]}>
            Detect Disease
          </Text>
        </TouchableOpacity>
      </View>

      {selectedDisease ? (
        <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backToListButton} onPress={() => setSelectedDisease(null)}>
            <Ionicons name="chevron-back" size={16} color="#d32f2f" />
            <Text style={styles.backToListText}>Back to diseases</Text>
          </TouchableOpacity>

          <Image source={{ uri: selectedDisease.imageUrl }} style={styles.detailImage} resizeMode="cover" />

          <View style={styles.detailContent}>
            <Text style={styles.detailName}>{selectedDisease.name}</Text>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Affected Crop</Text>
              <View style={styles.affectedCropContainer}>
                <MaterialCommunityIcons name="sprout" size={18} color="#d32f2f" />
                <Text style={styles.affectedCropText}>{selectedDisease.affectedCrop}</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Symptoms</Text>
              {Array.isArray(selectedDisease.symptoms)
              ? selectedDisease.symptoms.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{item}</Text>
                </View>
                ))
              : <Text style={styles.descriptionText}>{selectedDisease.symptoms}</Text>}
            </View>


            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Causes</Text>
              {Array.isArray(selectedDisease.causes)
              ? selectedDisease.causes.map((item, index) => (
              <View key={index} style={styles.bulletItem}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>{item}</Text>
              </View>
               ))
              : <Text style={styles.descriptionText}>{selectedDisease.causes}</Text>}
            </View>


            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Prevention</Text>
              {Array.isArray(selectedDisease.prevention)
                ? selectedDisease.prevention.map((item, index) => (
                    <View key={index} style={styles.bulletItem}>
                      <View style={styles.bullet} />
                      <Text style={styles.bulletText}>{item}</Text>
                    </View>
                  ))
                : <Text style={styles.descriptionText}>{selectedDisease.prevention}</Text>}
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Treatment</Text>
              {Array.isArray(selectedDisease.treatment)
                ? selectedDisease.treatment.map((item, index) => ( 
                    <View key={index} style={styles.bulletItem}>
                      <View style={styles.bullet} />
                      <Text style={styles.bulletText}>{item}</Text>
                    </View>
                  ))
                : <Text style={styles.descriptionText}>{selectedDisease.treatment}</Text>}
            </View>
                

            <TouchableOpacity
              style={styles.textToSpeechButton}
              onPress={speakDiseaseInfo}
            >
              <Ionicons name="volume-high" size={18} color="white" />
              <Text style={styles.textToSpeechButtonText}>Listen to Information</Text>
            </TouchableOpacity>
            

          </View>
        </ScrollView>
      ) : selectedImage ? (
        <View style={styles.detectionContainer}>
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} resizeMode="cover" />
            <TouchableOpacity style={styles.resetButton} onPress={resetDetection}>
              <Ionicons name="close-circle" size={28} color="#d32f2f" />
            </TouchableOpacity>
          </View>

          {isAnalyzing ? (
            <View style={styles.analyzingContainer}>
              <ActivityIndicator size="large" color="#d32f2f" />
              <Text style={styles.analyzingText}>Analyzing image...</Text>
            </View>
          ) : detectedDisease ? (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }}>
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Disease Detected</Text>
                <View style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultName}>{detectedDisease.name}</Text>
                    <Text style={styles.resultScientificName}>{detectedDisease.scientificName}</Text>
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Affected Crop</Text>
                    <Text style={styles.resultText}>{detectedDisease.affectedCrop}</Text>
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Symptoms</Text>
                    <Text style={styles.resultText}>
                      {Array.isArray(detectedDisease.symptoms)
                        ? detectedDisease.symptoms.join(", ")
                        : detectedDisease.symptoms}
                    </Text>
                  </View>
                      
                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={async () => {
                    try {
                      const res = await fetch(`http://192.168.100.195:5000/api/disease-details?name=${encodeURIComponent(detectedDisease.name)}`);
                      const raw = await res.text();
                      let json;
                      try {
                        json = JSON.parse(raw);
                      } catch (e) {
                        Alert.alert("Server Error", `Invalid JSON from backend\nPreview:\n${raw.slice(0,200)}`);
                        setSelectedDisease(detectedDisease); // fallback
                        return;
                      }

                    
                      // Merge data into detectedDisease object
                      setSelectedDisease({
                        ...detectedDisease,
                        imageUrl: json.imageUrl || detectedDisease.imageUrl || "https://via.placeholder.com/400x200?text=Disease",
                        symptoms: json.symptoms.length ? json.symptoms : detectedDisease.symptoms,
                        causes: json.causes.length ? json.causes : ["No data found"],
                        prevention: json.prevention.length ? json.prevention : ["No data found"],
                        treatment: json.treatment.length ? json.treatment : ["No data found"]
                      });
                    } catch (err) {
                      console.error("Error fetching disease details:", err.message);
                      // Fallback: still open details screen with existing minimal data
                      setSelectedDisease(detectedDisease);
                    }
                  }}

                  >
                    <Text style={styles.viewDetailsButtonText}>View Full Details</Text>
                    <Ionicons name="arrow-forward" size={16} color="#d32f2f" />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

          ) : (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage}>
                <Ionicons name="scan" size={22} color="white" />
                <Text style={styles.analyzeButtonText}>Analyze Image</Text>
              </TouchableOpacity>

              <Text style={styles.orText}>or</Text>

              <View style={styles.imageSourceButtons}>
                <TouchableOpacity style={styles.imageSourceButton} onPress={takePhoto}>
                  <Ionicons name="camera" size={22} color="#d32f2f" />
                  <Text style={styles.imageSourceButtonText}>Take New Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.imageSourceButton} onPress={pickImage}>
                  <Ionicons name="images" size={22} color="#d32f2f" />
                  <Text style={styles.imageSourceButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.browseContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search diseases or crops..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#aaa"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <FlatList
            data={filteredDiseases}
            renderItem={renderDiseaseItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.diseaseList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="leaf" size={50} color="#ccc" />
                <Text style={styles.emptyText}>No diseases found</Text>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d32f2f",
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#d32f2f",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  tabButtonTextActive: {
    color: "#d32f2f",
  },
  browseContainer: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  diseaseList: {
    padding: 16,
    paddingBottom: 30,
  },
  diseaseCard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  diseaseImage: {
    width: "100%",
    height: 150,
  },
  diseaseCardContent: {
    padding: 12,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  scientificName: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 8,
  },
  diseaseCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  diseaseCardTag: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  diseaseCardTagText: {
    fontSize: 12,
    color: "#d32f2f",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  detailsContainer: {
    flex: 1,
  },
  backToListButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backToListText: {
    fontSize: 14,
    color: "#d32f2f",
    fontWeight: "600",
    marginLeft: 4,
  },
  detailImage: {
    width: "100%",
    height: 20,
  },
  detailContent: {
    padding: 16,
  },
  detailName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  detailScientificName: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 20,
  },
  infoSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  affectedCropContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  affectedCropText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d32f2f",
    marginTop: 6,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  textToSpeechButton: {
    backgroundColor: "#d32f2f",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  textToSpeechButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
  detectionContainer: {
    flex: 1,
    padding: 16,
  },
  selectedImageContainer: {
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
  actionButtonsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  analyzeButton: {
    backgroundColor: "#d32f2f",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    marginBottom: 20,
  },
  analyzeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  orText: {
    fontSize: 14,
    color: "#666",
    marginVertical: 10,
  },
  imageSourceButtons: {
    width: "100%",
    marginTop: 10,
  },
  imageSourceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#d32f2f",
    borderRadius: 8,
    marginBottom: 10,
  },
  imageSourceButtonText: {
    color: "#d32f2f",
    fontWeight: "600",
    marginLeft: 8,
  },
  analyzingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIndicator: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  analyzingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#d32f2f",
    fontWeight: "500",
  },
  resultContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 15,
  },
  resultCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  resultHeader: {
    marginBottom: 15,
  },
  resultName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  resultScientificName: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
  resultSection: {
    marginBottom: 12,
  },
  resultSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  resultText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffebee",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  viewDetailsButtonText: {
    color: "#d32f2f",
    fontWeight: "600",
    marginRight: 8,
  },
})

export default DiseaseInfoScreen
