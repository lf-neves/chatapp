import { Button, Input, List, ListItem, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type SocketMessage = {
  user: string;
  text: string;
};

export const ChatView: React.FC<any> = ({ socket }) => {
  const router = useRouter();
  const username = router.query.name;
  const room = router.query.room;

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
    socket.emit("sendMessage", room, username, inputValue, () => {});
    setInputValue("");
  };
  return (
    <>
      <Text fontWeight={700} fontSize={25} mb={10}>
        {username}
      </Text>

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
    </>
  );
};
