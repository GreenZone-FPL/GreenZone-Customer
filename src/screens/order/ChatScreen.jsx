import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  Alert,
  FlatList,
  Image,
} from "react-native";
import io from "socket.io-client";
import { colors } from "../../constants/color";
import { Column, Row, NormalText, PrimaryButton, FlatInput } from "../../components/";

const socket = io("https://serversocket-4oew.onrender.com/"); 
const ChatScreen = () => {
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    socket.on("receive message", (data) => {
      addMessage(data.userName, data.message);
    });

    socket.on("user typing", (data) => {
      setTypingStatus(`${data.userName} đang soạn tin...`);
      setTimeout(() => setTypingStatus(""), 3000);
    });

    socket.on("error", (error) => {
      if (error.type === "username_taken") {
        setIsLoggedIn(false);
        Alert.alert("Lỗi", error.message);
      }
    });

    return () => {
      socket.off("receive message");
      socket.off("user typing");
      socket.off("error");
    };
  }, []);

  const joinChat = () => {
    if (userName.trim()) {
      socket.emit("join", userName);
      setIsLoggedIn(true);
      setErrorMessage("");
    } else {
      setErrorMessage("Username is required!");
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send message", { message });
      addMessage("You", message, true);
      setMessage("");
    }
  };

  const addMessage = (userName, message, isYou = false) => {
    const newMessage = { userName, message, isYou };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleTyping = (text) => {
    setMessage(text);
    socket.emit("typing");
  };

  const renderItem = ({ item }) => {
    const isYou = item.isYou;
    return (
      <>
        {
          isYou ?
            <NormalText text={item.message} style={styles.messageText} />
            :
            <Row
              style={styles.messageContainer}
            >
              <Image
                source={{ uri: "https://catscanman.net/wp-content/uploads/2021/09/anh-meo-cute-de-thuong-32.jpg" }}
                style={styles.avatar}
              />
              <Column style={styles.messageContent}>
                <NormalText text={item.userName} style={{ fontWeight: '500' }} />
                <NormalText text={item.message} style={{ textAlign: 'justify', lineHeight: 20 }} />

              </Column>
            </Row >


        }

      </>

    );
  };

  return (
    <>
      {!isLoggedIn ? (
        <Column style={{ padding: 16 }}>
          <Text style={styles.header}>Join Chat Room</Text>
          <FlatInput
            label="Enter your name"
            placeholder="Nguyen Van A"
            value={userName}
            setValue={setUserName}
            message={errorMessage}
          />

          <PrimaryButton title='Join' onPress={joinChat} />
        </Column>
      ) : (
        <Column style={styles.chatRoom}>
          <Text style={styles.header}>Chat Room</Text>
          <FlatList
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ flexGrow: 1, gap: 12 }}
          />
          <NormalText style={{ fontStyle: 'italic' }} text={typingStatus} />

          <FlatInput
            label="Enter message"
            placeholder=""
            value={message}
            setValue={handleTyping}
          />
          <PrimaryButton title='Send' onPress={sendMessage} />

        </Column>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  joinChat: {
    backgroundColor: "white",
  },
  chatRoom: {
    backgroundColor: 'white',
    padding: 16,
    flex: 1,
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: 'flex-start',
  
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 6,
  },
  messageContent: {
    maxWidth: "80%",
    backgroundColor: 'white',
    elevation: 2,
    padding: 10,
    borderRadius: 6,
    borderBottomColor: colors.gray300,
    borderBottomWidth: 1
  },
  messageText: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.green500,
    maxWidth: '80%',
    lineHeight: 20,
    alignSelf: 'flex-end',
    textAlign: 'right'
  },
});

export default ChatScreen
