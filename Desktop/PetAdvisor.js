import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Configuration, OpenAIApi } from 'openai';

const apiKey = "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";
const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);
const prompt = "You are a chatbot named PetAdvisor. Your goal is to help pet owners. \n1st introduce yourself \n2nd ask the pet's age, sex, breed, name, and symptoms. \nAsk follow-up questions and say something uplifting to relieve the pet owner's anxiety during this stressful time. \n";

export default function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const generateResponse = async () => {
      try {
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: prompt + chatHistory.map(({ speaker, message }) => `${speaker}: ${message}`).join("\n"),
          temperature: 0.7,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        const message = response.data.choices[0].text.trim();
        addMessage("PetAdvisor", message);
      } catch (error) {
        console.log(error);
      }
    };

    if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].speaker === "user") {
      generateResponse();
    }
  }, [chatHistory]);

  const handleMessageChange = (text) => {
    setMessage(text);
  };

  const handleSendMessage = () => {
    addMessage("user", message);
    setMessage("");
  };

    const addMessage = (speaker, message) => {
    setChatHistory((prevChatHistory) => [...prevChatHistory, { speaker, message }]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatBox}>
        <View style={styles.chatHeader}>
          <MaterialIcons name="pets" size={64} color="purple" />
          <Text style={styles.chatTitle}>PetAdvisor</Text>
        </View>
        <ScrollView style={styles.chatMessages}>
          {chatHistory.map(({ speaker, message }, index) => (
            <View
              key={index}
              style={[
                styles.chatMessage,
                speaker === "PetAdvisor" ? styles.chatMessageReceived : styles.chatMessageSent,
              ]}
            >
              {speaker === "PetAdvisor" && (
                <MaterialIcons name="pets" size={16} color="yellow" style={{ marginRight: 8 }} />
              )}
              <Text style={styles.chatMessageText}>{message}</Text>
            </View>
          ))}
        </ScrollView>
        <KeyboardAvoidingView style={styles.chatInput} behavior="padding">
          <TextInput
            style={styles.input}
            placeholder="Type your message"
            onChangeText={handleMessageChange}
            value={message}
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
          />
          <Button title="Send" onPress={handleSendMessage} />
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    paddingTop: 24,
  },
  chatBox: {
    flex: 1,
    margin: 16,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chatTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
    marginRight: 8,
    textAlign: "center",
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  chatMessage: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 16,
    maxWidth: "80%",
  },
  chatMessageSent: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C5",
  },
  chatMessageReceived: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  chatMessageText: {
    fontSize: 16,
  },
  chatInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#eee",
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginRight: 8,
  },
});
