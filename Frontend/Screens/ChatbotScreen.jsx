"use client"

import { useState, useRef, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { BACKEND_URL } from '@env';



const Message = ({ message, isUser }) => {
    return (
        <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.botMessageContainer]}>
            <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.botMessageText]}>{message}</Text>
        </View>
    )
}

const ChatbotScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your agricultural assistant. How can I help you today? You can ask me about crop cultivation, fertilizers, pest control, harvesting, and more.",
            isUser: false,
        },
    ])
    const [inputText, setInputText] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollViewRef = useRef()
    const fadeAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start()
    }, [])

    const handleSend = async () => {
        if (inputText.trim() === "") return

        const userMessage = {
            id: messages.length + 1,
            text: inputText,
            isUser: true,
        }

        setMessages((prevMessages) => [...prevMessages, userMessage])
        setInputText("")
        setIsTyping(true)

        try {
            const backendUrl = `${BACKEND_URL}/api/chat`;
            console.log('Frontend: Sending request to:', backendUrl, 'with query:', inputText);

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: inputText }),
            });

            console.log('Frontend: Received response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text(); // Read as text first to see what it is
                console.error('Frontend: Backend returned non-OK response. Raw text:', errorText);
                try {
                    const errorData = JSON.parse(errorText); // Try parsing if it's JSON
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            id: messages.length + 2,
                            text: `Error: Failed to get response. ${errorData?.error || 'Please try again.'}`,
                            isUser: false,
                        },
                    ])
                } catch (parseError) {
                    console.error('Frontend: Failed to parse error response as JSON. It was:', errorText);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            id: messages.length + 2,
                            text: `Error: Unexpected response from server. Check backend logs. Response starts with: ${errorText.substring(0, Math.min(errorText.length, 100))}...`,
                            isUser: false,
                        },
                    ])
                }
            } else {
                const responseData = await response.json()
                console.log('Frontend: Received valid JSON response:', responseData);
                const botResponse = {
                    id: messages.length + 2,
                    text: responseData.response,
                    isUser: false,
                }
                setMessages((prevMessages) => [...prevMessages, botResponse])
            }
        } catch (error) {
            console.error('Frontend: Fetch error in handleSend:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: messages.length + 2,
                    text: 'Error: Could not connect to the server. Please check your internet connection and the backend.',
                    isUser: false,
                },
            ])
        } finally {
            setIsTyping(false)
        }
    }

    const handleSuggestionPress = async (suggestion) => {
        const userMessage = {
            id: messages.length + 1,
            text: suggestion,
            isUser: true,
        }

        setMessages((prevMessages) => [...prevMessages, userMessage])
        setIsTyping(true)

        try {
            const backendUrl = 'http://192.168.100.195:5000/api/chat';
            console.log('Frontend: Sending suggestion request to:', backendUrl, 'with query:', suggestion);

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: suggestion }),
            });

            console.log('Frontend: Received suggestion response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Frontend: Backend returned non-OK for suggestion. Raw text:', errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            id: messages.length + 2,
                            text: `Error: Failed to get response. ${errorData?.error || 'Please try again.'}`,
                            isUser: false,
                        },
                    ])
                } catch (parseError) {
                    console.error('Frontend: Failed to parse suggestion error response as JSON. It was:', errorText);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            id: messages.length + 2,
                            text: `Error: Unexpected response from server. Check backend logs. Response starts with: ${errorText.substring(0, Math.min(errorText.length, 100))}...`,
                            isUser: false,
                        },
                    ])
                }
            } else {
                const responseData = await response.json()
                console.log('Frontend: Received valid JSON response for suggestion:', responseData);
                const botResponse = {
                    id: messages.length + 2,
                    text: responseData.response,
                    isUser: false,
                }
                setMessages((prevMessages) => [...prevMessages, botResponse])
            }
        } catch (error) {
            console.error('Frontend: Fetch error in handleSuggestionPress:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: messages.length + 2,
                    text: 'Error: Could not connect to the server. Please check your internet connection and the backend.',
                    isUser: false,
                },
            ])
        } finally {
            setIsTyping(false)
        }
    }

    const suggestions = [
        "How to grow wheat?",
        "Best fertilizer for rice",
        "How to control pests in cotton?",
        "When to harvest maize?",
        "Water requirements for sugarcane",
    ]

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#6200ea" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>AI Assistant</Text>
                    <Text style={styles.headerSubtitle}>Ask me anything about farming</Text>
                </View>
                <TouchableOpacity style={styles.infoButton}>
                    <Ionicons name="information-circle" size={24} color="#6200ea" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                >
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <View style={styles.welcomeContainer}>
                            <View style={styles.botAvatarContainer}>
                                <MaterialCommunityIcons name="robot" size={30} color="white" />
                            </View>
                            <Text style={styles.welcomeTitle}>Agri-Smart Assistant</Text>
                            <Text style={styles.welcomeText}>
                                I can help you with agricultural questions and provide guidance for your farming needs.
                            </Text>
                        </View>

                        {messages.map((message) => (
                            <Message key={message.id} message={message.text} isUser={message.isUser} />
                        ))}

                        {isTyping && (
                            <View style={styles.typingContainer}>
                                <View style={styles.typingBubble}>
                                    <View style={styles.typingDot} />
                                    <View style={styles.typingDot} />
                                    <View style={styles.typingDot} />
                                </View>
                            </View>
                        )}
                    </Animated.View>
                </ScrollView>

                {messages.length < 3 && (
                    <View style={styles.suggestionsContainer}>
                        <Text style={styles.suggestionsTitle}>Suggested Questions</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.suggestionsScrollContent}
                        >
                            {suggestions.map((suggestion, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.suggestionButton}
                                    onPress={() => handleSuggestionPress(suggestion)}
                                >
                                    <Text style={styles.suggestionText}>{suggestion}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask me about farming..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <Ionicons name="send" size={20} color={inputText.trim() ? "white" : "#ccc"} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f5f0ff",
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        backgroundColor: "white",
    },
    backButton: {
        padding: 8,
    },
    headerTitleContainer: {
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#6200ea",
    },
    headerSubtitle: {
        fontSize: 12,
        color: "#666",
    },
    infoButton: {
        padding: 8,
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    messagesContent: {
        paddingBottom: 10,
    },
    welcomeContainer: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    botAvatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#6200ea",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    welcomeTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
    },
    messageContainer: {
        maxWidth: "80%",
        marginBottom: 12,
        padding: 12,
        borderRadius: 16,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    userMessageContainer: {
        alignSelf: "flex-end",
        backgroundColor: "#6200ea",
        borderTopRightRadius: 4,
    },
    botMessageContainer: {
        alignSelf: "flex-start",
        backgroundColor: "white",
        borderTopLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    userMessageText: {
        color: "white",
    },
    botMessageText: {
        color: "#333",
    },
    typingContainer: {
        alignSelf: "flex-start",
        marginBottom: 12,
    },
    typingBubble: {
        flexDirection: "row",
        backgroundColor: "#e0e0e0",
        borderRadius: 16,
        padding: 10,
        width: 60,
        justifyContent: "center",
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#888",
        marginHorizontal: 2,
        opacity: 0.7,
    },
    suggestionsContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        backgroundColor: "white",
    },
    suggestionsTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        marginBottom: 10,
    },
    suggestionsScrollContent: {
        paddingRight: 16,
    },
    suggestionButton: {
        backgroundColor: "#f0e6ff",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "#d9c5ff",
    },
    suggestionText: {
        fontSize: 13,
        color: "#6200ea",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        backgroundColor: "white",
    },
    input: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
        fontSize: 16,
        color: "#333",
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#6200ea",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
    },
    sendButtonDisabled: {
        backgroundColor: "#e0e0e0",
    },
})

export default ChatbotScreen