"use client"

import { useState } from "react"
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
} from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"


const { width } = Dimensions.get("window")

const fruitsData = [
  {
    id: 1,
    name: "Mango",
    scientificName: "Mangifera indica",
    imageUrl:
      "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2022/01/mangoes_what_to_know_1296x728_header-1024x575.jpg",
    growthStages: [
      {
        stage: "Flowering",
        description: "Development of inflorescence and flowering. Typically occurs between December and March.",
        duration: "3-4 weeks",
        careNeeds: "Protect from strong winds and heavy rain. Avoid irrigation during flowering.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Fruit Set",
        description: "Small fruits begin to form after successful pollination. Many fruits may drop naturally.",
        duration: "2-3 weeks",
        careNeeds: "Light irrigation if dry. Apply potassium-rich fertilizer.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Fruit Development",
        description: "Fruits grow in size and begin to develop their characteristic shape.",
        duration: "6-8 weeks",
        careNeeds: "Regular irrigation. Protection from pests like fruit flies.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Maturation",
        description: "Fruits reach full size and begin to ripen. Color changes from green to yellow/red.",
        duration: "3-4 weeks",
        careNeeds: "Reduce irrigation. Protect from birds and bats.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Ripening",
        description: "Fruits fully ripen with characteristic color, aroma, and softness.",
        duration: "1-2 weeks",
        careNeeds: "Harvest at appropriate time. Handle carefully to avoid bruising.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
    ],
  },
  {
    id: 2,
    name: "Banana",
    scientificName: "Musa paradisiaca",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQesSrtbOPa42hHvvWs9mIhxAXP_AVdnhu55A&s",
    growthStages: [
      {
        stage: "Vegetative Growth",
        description: "Development of pseudostem and leaves. Plant grows to full height.",
        duration: "6-8 months",
        careNeeds: "Regular irrigation and fertilization. Protection from strong winds.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Flowering",
        description: "Emergence of the inflorescence (banana heart) from the top of the pseudostem.",
        duration: "2-3 weeks",
        careNeeds: "Maintain consistent moisture. Apply potassium-rich fertilizer.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Fruit Development",
        description: "Formation of hands and fingers (individual bananas). Fruits grow upward initially.",
        duration: "4-6 weeks",
        careNeeds: "Regular irrigation. Remove male bud after fruit set if desired.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Maturation",
        description: "Fruits reach full size and begin to turn from angular to round in shape.",
        duration: "4-6 weeks",
        careNeeds: "Support bunch if heavy. Protect from sunburn with leaves if necessary.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Ripening",
        description: "Color changes from green to yellow. Starch converts to sugar.",
        duration: "1-2 weeks",
        careNeeds: "Harvest when mature but still green for commercial purposes.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
    ],
  },
  {
    id: 3,
    name: "Orange",
    scientificName: "Citrus sinensis",
    imageUrl: "https://www.science.org/do/10.5555/article.2386606/full/Orange_tree_branch_1280x720-1644914645840.jpg",
    growthStages: [
      {
        stage: "Flowering",
        description: "White fragrant flowers appear. Bees and other insects assist with pollination.",
        duration: "2-4 weeks",
        careNeeds: "Adequate water. Avoid overhead irrigation during flowering.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Fruit Set",
        description: "Small green fruits begin to form after successful pollination.",
        duration: "2-3 weeks",
        careNeeds: "Regular irrigation. Apply balanced fertilizer.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Cell Division",
        description: "Rapid cell division occurs. Fruit size increases slowly.",
        duration: "4-6 weeks",
        careNeeds: "Consistent moisture. Protection from pests.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Cell Enlargement",
        description: "Fruits grow rapidly in size. Remain green in color.",
        duration: "3-4 months",
        careNeeds: "Regular irrigation. Apply potassium-rich fertilizer.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Maturation and Ripening",
        description: "Color changes from green to orange. Sugar content increases and acidity decreases.",
        duration: "2-3 months",
        careNeeds: "Reduce irrigation slightly. Monitor for ripeness.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
    ],
  },
  {
    id: 4,
    name: "Apple",
    scientificName: "Malus domestica",
    imageUrl: "https://images.everydayhealth.com/images/diet-nutrition/apples-101-about-1440x810.jpg?sfvrsn=f86f2644_5",
    growthStages: [
      {
        stage: "Dormancy",
        description: "Winter rest period. No visible growth but important for fruit bud development.",
        duration: "2-3 months",
        careNeeds: "Winter pruning. Apply dormant oil spray if needed.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Bud Break",
        description: "Buds swell and begin to open, showing green leaf tips.",
        duration: "1-2 weeks",
        careNeeds: "Protection from late frosts. Begin disease management.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Flowering",
        description: "Pink buds open to white or pink-tinged flowers. Pollination occurs.",
        duration: "1-2 weeks",
        careNeeds: "Ensure pollinators are present. Avoid pesticides during bloom.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Fruit Set",
        description: "Small fruitlets form after successful pollination. Natural thinning occurs.",
        duration: "2-3 weeks",
        careNeeds: "Additional thinning may be needed. Begin pest management.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Fruit Development",
        description: "Fruits grow in size. Seeds develop within the core.",
        duration: "2-3 months",
        careNeeds: "Regular irrigation. Pest and disease management.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Maturation and Ripening",
        description: "Fruits reach full size. Color changes and starch converts to sugar.",
        duration: "2-4 weeks",
        careNeeds: "Monitor for ripeness. Harvest at appropriate stage.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
    ],
  },
  {
    id: 5,
    name: "Grapes",
    scientificName: "Vitis vinifera",
    imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=300&fit=crop",
    growthStages: [
      {
        stage: "Bud Break",
        description: "Buds swell and burst open, showing green shoots.",
        duration: "1-2 weeks",
        careNeeds: "Protection from late frosts. Begin disease management.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Shoot Growth",
        description: "Rapid growth of shoots and development of leaves.",
        duration: "4-6 weeks",
        careNeeds: "Training of shoots. Disease management.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Flowering",
        description: "Small, inconspicuous flowers appear in clusters.",
        duration: "1-2 weeks",
        careNeeds: "Avoid overhead irrigation. Disease management critical.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Fruit Set",
        description: "Small berries form after successful pollination.",
        duration: "2-3 weeks",
        careNeeds: "Cluster thinning if needed. Continue disease management.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Berry Growth",
        description: "Berries increase in size but remain hard and green.",
        duration: "4-6 weeks",
        careNeeds: "Regular irrigation. Canopy management for sun exposure.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Veraison",
        description: "Berries begin to soften and change color (red or purple varieties).",
        duration: "2-3 weeks",
        careNeeds: "Reduce irrigation. Bird netting may be needed.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
      {
        stage: "Ripening",
        description: "Sugar content increases. Flavors and aromas develop.",
        duration: "2-4 weeks",
        careNeeds: "Monitor sugar levels. Protect from birds and insects.",
        imageUrl:
          "https://media.istockphoto.com/id/1307292536/photo/mango-tree-flower.jpg?s=612x612&w=0&k=20&c=Rl-OLy9bLz2fSuRlESVcZ-gMXSCm7ZVKDHGJgm7FZzs=",
      },
    ],
  },
]

const FruitsGrowthStagesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFruit, setSelectedFruit] = useState(null)
  const [selectedStage, setSelectedStage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectedFruit, setDetectedFruit] = useState(null)

  const filteredFruits = fruitsData.filter(
    (fruit) =>
      fruit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fruit.scientificName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (permissionResult.granted === false) {
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
        setDetectedFruit(null)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image: " + error.message)
    }
  }

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

      if (permissionResult.granted === false) {
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
        setDetectedFruit(null)
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
      name: "fruit.jpg",
      type: "image/jpeg",
    })

    // Call your backend (fruitsDetection.route.js)
    const response = await fetch("http://192.168.100.195:5003/predict-fruit-stage", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    const result = await response.json()
    if (response.ok && result.fruit_name) {
      // Try to match detection result with your static fruitsData
      const matchedFruit = fruitsData.find(
        fruit => fruit.name.toLowerCase() === result.fruit_name.toLowerCase()
      )

      if (matchedFruit) {
        setDetectedFruit(matchedFruit)
      } else {
        // If fruit not found in local data, just show name + confidence
        Alert.alert(
          "Fruit Detected",
          `Detected: ${result.fruit_name}\nConfidence: ${(result.confidence * 100).toFixed(1)}%`
        )
        setDetectedFruit(null)
      }
    } else {
      Alert.alert("Detection Failed", result.error || "Could not detect any fruit.")
      setDetectedFruit(null)
    }
  } catch (error) {
    Alert.alert("Error", "Failed to analyze image: " + error.message)
    setDetectedFruit(null)
  } finally {
    setIsAnalyzing(false)
  }
}


  const resetDetection = () => {
    setSelectedImage(null)
    setDetectedFruit(null)
  }

  const renderFruitItem = ({ item }) => (
    <TouchableOpacity
      style={styles.fruitCard}
      onPress={() => {
        setSelectedFruit(item)
        setSelectedStage(null)
      }}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.fruitImage} resizeMode="cover" />
      <View style={styles.fruitCardContent}>
        <Text style={styles.fruitName}>{item.name}</Text>
        <Text style={styles.scientificName}>{item.scientificName}</Text>
        <View style={styles.fruitCardFooter}>
          <View style={styles.fruitCardTag}>
            <Text style={styles.fruitCardTagText}>{item.growthStages.length} Growth Stages</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9c27b0" />
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderStageItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.stageCard, selectedStage?.stage === item.stage ? styles.stageCardSelected : null]}
      onPress={() => setSelectedStage(item)}
      activeOpacity={0.7}
    >
      <View style={styles.stageNumberContainer}>
        <Text style={styles.stageNumber}>{index + 1}</Text>
      </View>
      <Text style={styles.stageName}>{item.stage}</Text>
      <Ionicons
        name="chevron-forward"
        size={16}
        color="#9c27b0"
        style={selectedStage?.stage === item.stage ? styles.stageIconSelected : styles.stageIcon}
      />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#9c27b0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fruits Growth Stages</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedFruit === null && !selectedImage ? styles.tabButtonActive : null]}
          onPress={() => {
            setSelectedFruit(null)
            setSelectedImage(null)
            setDetectedFruit(null)
          }}
        >
          <Text
            style={[styles.tabButtonText, selectedFruit === null && !selectedImage ? styles.tabButtonTextActive : null]}
          >
            Browse Fruits
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedImage !== null ? styles.tabButtonActive : null]}
          onPress={() => {
            setSelectedFruit(null)
            if (!selectedImage) {
              Alert.alert("Fruit Detection", "Would you like to take a photo or choose from gallery?", [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Take Photo",
                  onPress: takePhoto,
                },
                {
                  text: "Choose Photo",
                  onPress: pickImage,
                },
              ])
            }
          }}
        >
          <Text style={[styles.tabButtonText, selectedImage !== null ? styles.tabButtonTextActive : null]}>
            Detect Fruit
          </Text>
        </TouchableOpacity>
      </View>

      {selectedFruit ? (
        <View style={styles.detailContainer}>
          <View style={styles.fruitHeaderContainer}>
            <TouchableOpacity style={styles.backToListButton} onPress={() => setSelectedFruit(null)}>
              <Ionicons name="chevron-back" size={16} color="#9c27b0" />
              <Text style={styles.backToListText}>Back to fruits</Text>
            </TouchableOpacity>

            <View style={styles.fruitHeader}>
              <Image source={{ uri: selectedFruit.imageUrl }} style={styles.fruitHeaderImage} resizeMode="cover" />
              <View style={styles.fruitHeaderContent}>
                <Text style={styles.fruitHeaderName}>{selectedFruit.name}</Text>
                <Text style={styles.fruitHeaderScientificName}>{selectedFruit.scientificName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.stagesContainer}>
            <Text style={styles.stagesTitle}>Growth Stages</Text>
            <FlatList
              data={selectedFruit.growthStages}
              renderItem={renderStageItem}
              keyExtractor={(item, index) => `${selectedFruit.id}-stage-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stagesList}
            />
          </View>

          {selectedStage ? (
            <ScrollView style={styles.stageDetailContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.stageDetailHeader}>
                <Text style={styles.stageDetailTitle}>{selectedStage.stage}</Text>
                <View style={styles.stageDurationContainer}>
                  <Ionicons name="time-outline" size={16} color="#9c27b0" />
                  <Text style={styles.stageDuration}>{selectedStage.duration}</Text>
                </View>
              </View>

              <Image source={{ uri: selectedStage.imageUrl }} style={styles.stageImage} resizeMode="cover" />

              <View style={styles.stageInfoSection}>
                <Text style={styles.stageInfoTitle}>Description</Text>
                <Text style={styles.stageInfoText}>{selectedStage.description}</Text>
              </View>

              <View style={styles.stageInfoSection}>
                <Text style={styles.stageInfoTitle}>Care Needs</Text>
                <Text style={styles.stageInfoText}>{selectedStage.careNeeds}</Text>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.selectStageContainer}>
              <MaterialCommunityIcons name="gesture-tap" size={60} color="#e1bee7" />
              <Text style={styles.selectStageText}>Select a growth stage to view details</Text>
            </View>
          )}
        </View>
      ) : selectedImage ? (
        <View style={styles.detectionContainer}>
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} resizeMode="cover" />
            <TouchableOpacity style={styles.resetButton} onPress={resetDetection}>
              <Ionicons name="close-circle" size={28} color="#9c27b0" />
            </TouchableOpacity>
          </View>

          {isAnalyzing ? (
            <View style={styles.analyzingContainer}>
              <View style={styles.loadingIndicator}>
                <Text style={styles.analyzingText}>Analyzing image...</Text>
              </View>
            </View>
          ) : detectedFruit ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Fruit Detected</Text>

              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultName}>{detectedFruit.name}</Text>
                  <Text style={styles.resultScientificName}>{detectedFruit.scientificName}</Text>
                </View>

                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>Growth Stages</Text>
                  <Text style={styles.resultText}>{detectedFruit.growthStages.length} stages available</Text>
                </View>

                <TouchableOpacity style={styles.viewDetailsButton} onPress={() => setSelectedFruit(detectedFruit)}>
                  <Text style={styles.viewDetailsButtonText}>View Growth Stages</Text>
                  <Ionicons name="arrow-forward" size={16} color="#9c27b0" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage}>
                <Ionicons name="scan" size={22} color="white" />
                <Text style={styles.analyzeButtonText}>Analyze Image</Text>
              </TouchableOpacity>

              <Text style={styles.orText}>or</Text>

              <View style={styles.imageSourceButtons}>
                <TouchableOpacity style={styles.imageSourceButton} onPress={takePhoto}>
                  <Ionicons name="camera" size={22} color="#9c27b0" />
                  <Text style={styles.imageSourceButtonText}>Take New Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.imageSourceButton} onPress={pickImage}>
                  <Ionicons name="images" size={22} color="#9c27b0" />
                  <Text style={styles.imageSourceButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        <>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search fruits..."
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
            data={filteredFruits}
            renderItem={renderFruitItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.fruitList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="fruit-cherries-off" size={50} color="#ccc" />
                <Text style={styles.emptyText}>No fruits found</Text>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#faf4fb",
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
    color: "#9c27b0",
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
    borderBottomColor: "#9c27b0",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  tabButtonTextActive: {
    color: "#9c27b0",
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
  fruitList: {
    padding: 16,
    paddingBottom: 30,
  },
  fruitCard: {
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
  fruitImage: {
    width: "100%",
    height: 150,
  },
  fruitCardContent: {
    padding: 12,
  },
  fruitName: {
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
  fruitCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  fruitCardTag: {
    backgroundColor: "#f3e5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  fruitCardTagText: {
    fontSize: 12,
    color: "#9c27b0",
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
  detailContainer: {
    flex: 1,
  },
  fruitHeaderContainer: {
    backgroundColor: "white",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backToListButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  backToListText: {
    fontSize: 14,
    color: "#9c27b0",
    fontWeight: "600",
    marginLeft: 4,
  },
  fruitHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  fruitHeaderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  fruitHeaderContent: {
    marginLeft: 12,
    flex: 1,
  },
  fruitHeaderName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  fruitHeaderScientificName: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
  stagesContainer: {
    padding: 16,
  },
  stagesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  stagesList: {
    paddingRight: 16,
  },
  stageCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    minWidth: 120,
  },
  stageCardSelected: {
    backgroundColor: "#f3e5f5",
    borderColor: "#9c27b0",
  },
  stageNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f3e5f5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  stageNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#9c27b0",
  },
  stageName: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  stageIcon: {
    opacity: 0.5,
  },
  stageIconSelected: {
    opacity: 1,
  },
  selectStageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  selectStageText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
  },
  stageDetailContainer: {
    flex: 1,
    padding: 16,
  },
  stageDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  stageDetailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  stageDurationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3e5f5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stageDuration: {
    fontSize: 12,
    color: "#9c27b0",
    marginLeft: 4,
  },
  stageImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  stageInfoSection: {
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
  stageInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  stageInfoText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
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
    backgroundColor: "#9c27b0",
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
    borderColor: "#9c27b0",
    borderRadius: 8,
    marginBottom: 10,
  },
  imageSourceButtonText: {
    color: "#9c27b0",
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
    color: "#9c27b0",
    fontWeight: "500",
  },
  resultContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9c27b0",
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
    backgroundColor: "#f3e5f5",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  viewDetailsButtonText: {
    color: "#9c27b0",
    fontWeight: "600",
    marginRight: 8,
  },
})

export default FruitsGrowthStagesScreen
