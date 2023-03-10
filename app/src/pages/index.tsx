import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Input, List, ListItem } from "@chakra-ui/react";

type SocketMessage = {
  user: string;
  text: string;
};

export default function Home() {
  const socket = io("http://localhost:8000");

  const [messages, setMessages] = useState<Array<SocketMessage>>([]);
  const [inputValue, setInputValue] = useState("");

  socket.on("connect", () => {
    console.log("Connection: " + socket.connected);
  });

  useEffect(() => {
    socket.on("message", (message: SocketMessage): void => {
      console.log("Message received back");
      setMessages([...messages, message]);
    });
  }, [messages, socket]);

  const sendMessage = () => {
    socket.emit("sendMessage", inputValue, () => {});
  };

  return (
    <Container p={10}>
      <List spacing={3}>
        {messages.map((message, index) => (
          <ListItem
            key={index}
            style={{ marginBottom: "5px" }}
          >{`${message.user} said: ${message.text}`}</ListItem>
        ))}
      </List>

      <Input
        placeholder="Type your message here"
        backgroundColor={"transparent"}
        border="none"
        my={5}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <Button onClick={sendMessage} colorScheme="blue">
        Send Message
      </Button>
    </Container>
  );
}
